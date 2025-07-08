import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import multer from "multer";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import { storage } from "./storage";
import { requireAuth, requireAdminAuth, hashPassword, verifyPassword, createUserSession } from "./auth";
import { 
  requireSuperAdminAuth, 
  handleSuperAdminLogin, 
  handleSuperAdminLogout, 
  getCurrentSuperAdmin 
} from "./superAdminAuth";
import {
  requireAdminRole,
  requireAdmin,
  requireSuperAdmin,
  requireResourceAccess,
  auditLog,
  hasPermission,
  getCurrentUser
} from "./authorizationMiddleware";
import { 
  insertProfileSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  registerUserSchema,
  loginUserSchema
} from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure multer for file uploads
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('video/') ? 'uploads/videos' : 'uploads/images';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${nanoid()}${fileExtension}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // =============================================================================
  // MEDIA UPLOAD ROUTES - Handle file uploads for profiles
  // =============================================================================
  
  // Serve uploaded files statically
  app.use('/uploads', express.static('uploads'));
  
  // Upload multiple files (photos and videos)
  app.post("/api/upload", upload.array('files', 20), (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${file.filename}`
      }));
      
      res.json({ 
        message: "Files uploaded successfully", 
        files: uploadedFiles 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error uploading files: " + error.message });
    }
  });
  
  // =============================================================================
  // PUBLIC PROFILE API ROUTES
  // =============================================================================
  
  // Get featured profiles
  app.get("/api/profiles/featured", async (req, res) => {
    try {
      const profiles = await storage.getProfiles({ 
        approved: true, 
        featured: true 
      });
      res.json(profiles);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured profiles: " + error.message });
    }
  });

  // Get all approved profiles with filters
  app.get("/api/profiles", async (req, res) => {
    try {
      const { ageMin, ageMax, location, search } = req.query;
      
      if (search) {
        const profiles = await storage.searchProfiles(search as string);
        res.json(profiles);
      } else {
        const profiles = await storage.getProfiles({
          approved: true,
          ageMin: ageMin ? parseInt(ageMin as string) : undefined,
          ageMax: ageMax ? parseInt(ageMax as string) : undefined,
          location: location as string,
        });
        res.json(profiles);
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching profiles: " + error.message });
    }
  });

  // Get individual profile by ID
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      if (!profile.isApproved) {
        return res.status(403).json({ message: "Profile not approved" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching profile: " + error.message });
    }
  });

  // Get individual profile by slug
  app.get("/api/profiles/by-slug/:slug/:language", async (req, res) => {
    try {
      const { slug, language } = req.params;
      const profile = await storage.getProfileBySlug(slug, language);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      if (!profile.isApproved) {
        return res.status(403).json({ message: "Profile not approved" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching profile: " + error.message });
    }
  });

  // Submit profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating profile: " + error.message });
    }
  });

  // Admin: Approve profile
  app.patch("/api/profiles/:id/approve", async (req, res) => {
    try {
      const profile = await storage.approveProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error approving profile: " + error.message });
    }
  });

  // Create payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, profileIds, customerEmail } = req.body;
      
      if (!amount || !profileIds) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          customerEmail: customerEmail || "placeholder@email.com",
          profileIds: JSON.stringify(profileIds),
        },
      });

      // Create order
      const order = await storage.createOrder({
        customerEmail: customerEmail || "placeholder@email.com",
        totalAmount: amount.toString(),
        stripePaymentIntentId: paymentIntent.id,
        status: "pending"
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        orderId: order.id 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Create hosted checkout session (fallback for ad blockers)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { amount, profileIds, customerEmail, profileNames } = req.body;
      
      console.log('Creating hosted checkout session for:', { amount, profileIds, customerEmail });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Contact Information - ${profileNames.join(', ')}`,
                description: `Access to contact details for ${profileIds.length} profile(s)`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout`,
        customer_email: customerEmail,
        metadata: {
          profileIds: JSON.stringify(profileIds),
          orderType: 'contact_purchase'
        }
      });

      // Create order for hosted checkout
      const order = await storage.createOrder({
        customerEmail: customerEmail || "placeholder@email.com", 
        totalAmount: amount.toString(),
        stripePaymentIntentId: session.id, // Use session ID for hosted checkout
        status: "pending"
      });
      
      res.json({ url: session.url, sessionId: session.id, orderId: order.id });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ message: "Error creating checkout session" });
    }
  });

  // Update payment intent with customer details
  app.post("/api/update-payment-intent", async (req, res) => {
    try {
      const { customerEmail, customerName, profileIds } = req.body;
      
      if (!customerEmail || !profileIds) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Find the most recent pending order for these profile IDs
      // This is a simplified approach - in production you might want a more sophisticated matching system
      const orders = await storage.getOrdersForAdmin({ status: "pending", limit: 10 });
      const recentOrder = orders.find(order => 
        order.stripePaymentIntentId && 
        order.status === "pending"
      );

      if (recentOrder?.stripePaymentIntentId) {
        // Update the Stripe PaymentIntent metadata
        await stripe.paymentIntents.update(recentOrder.stripePaymentIntentId, {
          metadata: {
            customerEmail,
            customerName: customerName || "Guest Customer",
            profileIds: JSON.stringify(profileIds),
          },
        });

        // Update the order with correct customer email
        await storage.updateOrder(recentOrder.id, { 
          customerEmail,
          customerName: customerName || "Guest Customer"
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating payment intent: " + error.message });
    }
  });

  // Handle payment success and deliver contact info (Elements and Hosted Checkout)
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId, sessionId } = req.body;
      
      if (!paymentIntentId && !sessionId) {
        return res.status(400).json({ message: "Payment intent ID or session ID required" });
      }

      let paymentData;
      let profileIds;

      if (sessionId) {
        // Handle hosted checkout session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== "paid") {
          return res.status(400).json({ message: "Payment not successful" });
        }

        profileIds = JSON.parse(session.metadata?.profileIds || "[]");
        paymentData = { id: sessionId, metadata: session.metadata };
      } else {
        // Handle payment intent (Elements)
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== "succeeded") {
          return res.status(400).json({ message: "Payment not successful" });
        }

        profileIds = JSON.parse(paymentIntent.metadata.profileIds || "[]");
        paymentData = paymentIntent;
      }

      // Find the order
      const order = await storage.getOrderByPaymentIntent(paymentData.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order status
      await storage.updateOrderStatus(order.id, "completed");
      
      // Create order items with contact info
      const orderItemsData = [];
      for (const profileId of profileIds) {
        const profile = await storage.getProfile(profileId);
        if (profile) {
          const orderItem = await storage.createOrderItem({
            orderId: order.id,
            profileId: profile.id,
            price: profile.price,
            contactInfo: profile.contactMethods || {}
          });
          orderItemsData.push({
            ...orderItem,
            profile: {
              id: profile.id,
              firstName: profile.firstName,
              lastName: profile.lastName,
              age: profile.age,
              location: profile.location,
              photos: profile.photos
            }
          });
        }
      }

      res.json({
        success: true,
        order: order,
        contactInfo: orderItemsData
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing payment success: " + error.message });
    }
  });

  // Get order details (for customers to retrieve their purchase)
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderItems = await storage.getOrderItemsWithProfiles(order.id);
      
      res.json({
        ...order,
        items: orderItems
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  // =============================================================================
  // ADMIN PANEL API ROUTES - PROTECTED FROM REGULAR USERS (STEP 1 ENFORCEMENT)
  // =============================================================================
  
  // Admin dashboard statistics - ADMIN ONLY
  app.get("/api/admin/dashboard-stats", 
    requireAdmin, 
    auditLog('view_dashboard_stats', 'dashboard'), 
    async (req, res) => {
    try {
      // Get profile counts
      const profileStats = await storage.getProfileCountByStatus();
      
      // Get order stats
      const orderStats = await storage.getOrderStats();
      
      // Get user count (using regular users table)
      const userCount = await storage.getProfiles(); // Use profiles as user count proxy
      
      res.json({
        totalUsers: userCount.length,
        activeProfiles: profileStats.approved,
        pendingProfiles: profileStats.pending,
        totalOrders: orderStats.total,
        completedOrders: orderStats.completed,
        totalRevenue: orderStats.revenue
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching dashboard stats: " + error.message });
    }
  });

  // Admin recent profiles - ADMIN ONLY
  app.get("/api/admin/recent-profiles", 
    requireAdmin, 
    auditLog('view_recent_profiles', 'profile'), 
    async (req, res) => {
    try {
      const profiles = await storage.getProfilesForAdmin({
        limit: 10
      });
      res.json(profiles);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching recent profiles: " + error.message });
    }
  });

  // Admin get single profile for editing - ADMIN ONLY
  app.get("/api/admin/profiles/:id", 
    requireAdmin, 
    requireResourceAccess('profile', (req) => parseInt(req.params.id), { read: true, admin: true }),
    auditLog('view_profile', 'profile', (req) => parseInt(req.params.id)), 
    async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching profile: " + error.message });
    }
  });

  // Admin profile update - ADMIN ONLY
  app.patch("/api/admin/profiles/:id", 
    requireAdmin, 
    requireResourceAccess('profile', (req) => parseInt(req.params.id), { write: true, admin: true }),
    auditLog('update_profile', 'profile', (req) => parseInt(req.params.id)), 
    async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const updateData = req.body;
      
      console.log(`Admin updating profile ${profileId}:`, updateData);
      
      const updatedProfile = await storage.updateProfile(profileId, updateData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      console.log('Profile updated successfully:', updatedProfile);
      res.json(updatedProfile);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: "Error updating profile: " + error.message });
    }
  });

  // Admin recent orders - ADMIN ONLY
  app.get("/api/admin/recent-orders", requireAdminAuth, async (req, res) => {
    try {
      const orders = await storage.getOrdersForAdmin({
        limit: 10
      });
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching recent orders: " + error.message });
    }
  });

  // Admin profile management - ADMIN ONLY
  app.get("/api/admin/profiles", requireAdminAuth, async (req, res) => {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      const approved = status === 'approved' ? true : status === 'pending' ? false : undefined;
      
      const profiles = await storage.getProfilesForAdmin({
        approved,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
      
      res.json(profiles);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching admin profiles: " + error.message });
    }
  });

  // Admin approve profile - ADMIN ONLY
  app.post("/api/admin/profiles/:id/approve", requireAdminAuth, async (req, res) => {
    try {
      const profile = await storage.approveProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      // TODO: Log admin activity
      // await storage.logAdminActivity({
      //   adminId: req.adminUser.id,
      //   action: "profile_approved",
      //   targetType: "profile",
      //   targetId: profile.id,
      //   details: {},
      //   ipAddress: req.ip
      // });
      
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error approving profile: " + error.message });
    }
  });

  // Admin orders management - ADMIN ONLY
  app.get("/api/admin/orders", requireAdminAuth, async (req, res) => {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      
      const orders = await storage.getOrdersForAdmin({
        status: status as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
      
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching admin orders: " + error.message });
    }
  });

  // Admin users management - ADMIN ONLY (manage front-end users, NOT admin users)
  app.get("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const { limit = 50, offset = 0, active } = req.query;
      
      const users = await storage.getUsersForAdmin({
        isActive: active === 'true' ? true : active === 'false' ? false : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
      
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching users: " + error.message });
    }
  });

  // Admin get user favorites - ADMIN ONLY
  app.get("/api/admin/user-favorites/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user favorites: " + error.message });
    }
  });

  // Admin get user orders - ADMIN ONLY
  app.get("/api/admin/user-orders/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrdersWithItems(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user orders: " + error.message });
    }
  });

  // =============================================================================
  // FRONT-END USER AUTHENTICATION API ROUTES - STEP 1 IMPLEMENTATION
  // =============================================================================
  
  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        email: userData.email,
        username: userData.username,
        passwordHash: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      
      // Create session
      const sessionId = await createUserSession(user.id);
      req.session.userId = sessionId;
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: "Registration failed: " + error.message });
    }
  });
  
  // User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const validPassword = await verifyPassword(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      const sessionId = await createUserSession(user.id);
      req.session.userId = sessionId;
      
      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: "Login failed: " + error.message });
    }
  });
  
  // User logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.session?.userId;
      if (sessionId) {
        await storage.deleteUserSession(sessionId);
      }
      
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
      });
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Logout failed: " + error.message });
    }
  });
  
  // Get current user
  app.get("/api/auth/user", requireAuth, async (req, res) => {
    res.json({
      id: req.user!.id,
      email: req.user!.email,
      username: req.user!.username,
      role: req.user!.role,
    });
  });
  
  // =============================================================================
  // USER FAVORITES API ROUTES - REQUIRES AUTHENTICATION (STEP 1 ENFORCEMENT)
  // =============================================================================
  
  // Get all user favorites - PROTECTED ROUTE
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id; // From authenticated session
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching favorites: " + error.message });
    }
  });
  
  // Add profile to favorites - PROTECTED ROUTE
  app.post("/api/favorites/:profileId", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id; // From authenticated session
      const profileId = parseInt(req.params.profileId);
      
      const favorite = await storage.addUserFavorite(userId, profileId);
      res.json(favorite);
    } catch (error: any) {
      res.status(500).json({ message: "Error adding favorite: " + error.message });
    }
  });
  
  // Remove profile from favorites - PROTECTED ROUTE
  app.delete("/api/favorites/:profileId", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id; // From authenticated session
      const profileId = parseInt(req.params.profileId);
      
      const removed = await storage.removeUserFavorite(userId, profileId);
      res.json({ success: removed });
    } catch (error: any) {
      res.status(500).json({ message: "Error removing favorite: " + error.message });
    }
  });
  
  // Get user's favorite profiles - PROTECTED ROUTE
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id; // From authenticated session
      
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching favorites: " + error.message });
    }
  });
  
  // Check if profile is favorited - PROTECTED ROUTE
  app.get("/api/favorites/:profileId/status", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id; // From authenticated session
      const profileId = parseInt(req.params.profileId);
      
      const isFavorited = await storage.isProfileFavorited(userId, profileId);
      res.json({ isFavorited });
    } catch (error: any) {
      res.status(500).json({ message: "Error checking favorite status: " + error.message });
    }
  });

  // =============================================================================
  // ADMIN AUTHENTICATION ROUTES - Admin panel login and authentication
  // =============================================================================

  // Admin login (for both admin and super admin roles)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Get admin user by username
      const adminUser = await storage.getAdminUserByUsername(username);
      if (!adminUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, adminUser.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if admin user is active
      if (!adminUser.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      // Create admin session
      const sessionId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await storage.createAdminSession({
        id: sessionId,
        adminId: adminUser.id,
        type: adminUser.role as "admin" | "superadmin",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown'
      });

      // Set session cookie - optimized for SUPER ADMIN session handling
      const cookieSettings = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Lax for development
        path: '/' // Ensure cookie is available across all paths
      };
      
      // Set the appropriate cookie based on user role for SUPER ADMIN session handling
      const cookieName = adminUser.role === 'superadmin' ? 'superAdminSession' : 'adminSession';
      
      console.log('🍪 SETTING SESSION COOKIE:', {
        sessionId: sessionId.substring(0, 10) + '...',
        cookieName: cookieName,
        cookieSettings: cookieSettings,
        userRole: adminUser.role,
        environment: process.env.NODE_ENV
      });
      
      res.cookie(cookieName, sessionId, cookieSettings);

      // Log admin login activity
      await storage.logAdminActivity({
        adminId: adminUser.id,
        action: 'admin_login',
        targetType: 'admin_user',
        targetId: adminUser.id,
        details: {
          ipAddress: req.ip || 'unknown',
          userAgent: req.get('User-Agent') || 'unknown',
          timestamp: new Date().toISOString()
        },
        ipAddress: req.ip || 'unknown',
      });

      // Return success response (without password hash)
      const { passwordHash, ...userResponse } = adminUser;
      res.json({
        success: true,
        user: userResponse
      });

    } catch (error: any) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: "Login failed: " + error.message });
    }
  });

  // Admin logout (handles both admin and superadmin)
  app.post("/api/admin/logout", async (req, res) => {
    try {
      // Check both possible cookie names
      const adminSessionId = req.cookies.adminSession;
      const superAdminSessionId = req.cookies.superAdminSession;
      const sessionId = adminSessionId || superAdminSessionId;
      
      console.log('🔥 ADMIN LOGOUT DEBUG:', {
        adminSessionId: adminSessionId ? 'FOUND' : 'NOT_FOUND',
        superAdminSessionId: superAdminSessionId ? 'FOUND' : 'NOT_FOUND',
        sessionId: sessionId ? 'FOUND' : 'NOT_FOUND'
      });
      
      if (sessionId) {
        // Delete admin session
        await storage.deleteAdminSession(sessionId);
        console.log('🗑️ SESSION DELETED:', sessionId);
      }

      // Clear both possible session cookies with proper settings
      res.clearCookie('adminSession', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      res.clearCookie('superAdminSession', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      console.log('✅ ADMIN LOGOUT SUCCESS - Cookies cleared');
      res.json({ success: true });

    } catch (error: any) {
      console.error('Admin logout error:', error);
      res.status(500).json({ message: "Logout failed: " + error.message });
    }
  });

  // Get current admin user
  app.get("/api/admin/user", requireAdmin, async (req, res) => {
    try {
      const currentUser = getCurrentUser(req);
      console.log('🔍 CURRENT USER DEBUG:', {
        userExists: !!currentUser,
        userType: currentUser?.type || 'N/A',
        userId: currentUser?.id || 'N/A'
      });
      
      if (currentUser) {
        // Remove passwordHash from response if it exists
        const { passwordHash, ...userResponse } = currentUser as any;
        res.json(userResponse);
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    } catch (error: any) {
      console.error('Error in /api/admin/user:', error);
      res.status(500).json({ message: "Error fetching user: " + error.message });
    }
  });

  // =============================================================================
  // SUPER ADMIN ROUTES - Secure super admin authentication and management
  // =============================================================================

  // Super admin login
  app.post("/api/super-admin/login", handleSuperAdminLogin);

  // Super admin logout  
  app.post("/api/super-admin/logout", requireSuperAdminAuth, handleSuperAdminLogout);

  // Get current super admin user
  app.get("/api/super-admin/user", requireSuperAdminAuth, getCurrentSuperAdmin);

  // =============================================================================
  // ADMIN MANAGEMENT ROUTES - Super Admin Only Access
  // =============================================================================

  // Get all admin users (super admin only)
  app.get("/api/admin/admins", requireSuperAdmin, async (req, res) => {
    try {
      const adminUsers = await storage.getAllAdminUsers();
      
      // Remove password hashes from response
      const safeAdminUsers = adminUsers.map(({ passwordHash, ...admin }) => admin);
      
      res.json(safeAdminUsers);
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      res.status(500).json({ message: "Failed to fetch admin users: " + error.message });
    }
  });

  // Create new admin user (super admin only)
  app.post("/api/admin/admins", requireSuperAdmin, async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      
      // Validate required fields
      if (!username || !email || !password || !role) {
        return res.status(400).json({ 
          message: "Username, email, password, and role are required" 
        });
      }

      // Check if role is valid
      if (!['admin', 'superadmin'].includes(role)) {
        return res.status(400).json({ 
          message: "Role must be 'admin' or 'superadmin'" 
        });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create admin user
      const newAdmin = await storage.createAdminUser({
        username,
        email,
        passwordHash,
        role,
        isActive: true
      });

      // Remove password hash from response
      const { passwordHash: _, ...safeAdmin } = newAdmin;
      
      // Log admin creation activity
      const currentUser = getCurrentUser(req);
      if (currentUser) {
        await storage.logAdminActivity({
          adminId: currentUser.id,
          action: 'admin_created',
          targetType: 'admin_user',
          targetId: newAdmin.id,
          details: JSON.stringify({
            createdUsername: username,
            createdRole: role,
            createdEmail: email
          })
        });
      }

      res.status(201).json(safeAdmin);
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      res.status(500).json({ message: "Failed to create admin user: " + error.message });
    }
  });

  // Update admin user (super admin only)
  app.patch("/api/admin/admins/:id", requireSuperAdmin, async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      const { username, email, role, isActive } = req.body;
      
      if (isNaN(adminId)) {
        return res.status(400).json({ message: "Invalid admin ID" });
      }

      // Validate role if provided
      if (role && !['admin', 'superadmin'].includes(role)) {
        return res.status(400).json({ 
          message: "Role must be 'admin' or 'superadmin'" 
        });
      }

      // Get current admin to prevent self-demotion
      const currentUser = getCurrentUser(req);
      if (currentUser && currentUser.id === adminId && role === 'admin' && currentUser.role === 'superadmin') {
        return res.status(400).json({ 
          message: "Cannot demote yourself from super admin" 
        });
      }

      // Update admin user
      const updatedAdmin = await storage.updateAdminUser(adminId, {
        username,
        email,
        role,
        isActive
      });

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      // Remove password hash from response
      const { passwordHash: _, ...safeAdmin } = updatedAdmin;
      
      // Log admin update activity
      if (currentUser) {
        await storage.logAdminActivity({
          adminId: currentUser.id,
          action: 'admin_updated',
          targetType: 'admin_user',
          targetId: adminId,
          details: JSON.stringify({
            updatedFields: { username, email, role, isActive }
          })
        });
      }

      res.json(safeAdmin);
    } catch (error: any) {
      console.error('Error updating admin user:', error);
      res.status(500).json({ message: "Failed to update admin user: " + error.message });
    }
  });

  // Delete admin user (super admin only)
  app.delete("/api/admin/admins/:id", requireSuperAdmin, async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      
      if (isNaN(adminId)) {
        return res.status(400).json({ message: "Invalid admin ID" });
      }

      // Prevent self-deletion
      const currentUser = getCurrentUser(req);
      if (currentUser && currentUser.id === adminId) {
        return res.status(400).json({ 
          message: "Cannot delete your own admin account" 
        });
      }

      // Get admin info before deletion for logging
      const adminToDelete = await storage.getAdminUser(adminId);
      if (!adminToDelete) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      // Delete admin user
      const deleted = await storage.deleteAdminUser(adminId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      // Log admin deletion activity
      if (currentUser) {
        await storage.logAdminActivity({
          adminId: currentUser.id,
          action: 'admin_deleted',
          targetType: 'admin_user',
          targetId: adminId,
          details: JSON.stringify({
            deletedUsername: adminToDelete.username,
            deletedRole: adminToDelete.role,
            deletedEmail: adminToDelete.email
          })
        });
      }

      res.json({ success: true, message: "Admin user deleted successfully" });
    } catch (error: any) {
      console.error('Error deleting admin user:', error);
      res.status(500).json({ message: "Failed to delete admin user: " + error.message });
    }
  });

  // =============================================================================
  // LEGACY SUPER ADMIN ROUTES - Keep for backward compatibility
  // =============================================================================

  // Get all admin users (legacy route)
  app.get("/api/super-admin/admin-users", requireSuperAdminAuth, async (req, res) => {
    try {
      const adminUsers = await storage.getAllAdminUsers();
      
      // Remove password hashes from response
      const safeAdminUsers = adminUsers.map(({ passwordHash, ...admin }) => admin);
      
      res.json(safeAdminUsers);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating admin user: " + error.message });
    }
  });

  // Update admin user (super admin only)
  app.patch("/api/super-admin/admin-users/:id", 
    requireSuperAdmin, 
    auditLog('update_admin_user', 'admin_user', (req) => parseInt(req.params.id)), 
    async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      const updates = req.body;

      // Hash password if provided
      if (updates.password) {
        updates.passwordHash = await hashPassword(updates.password);
        delete updates.password;
      }

      const updatedUser = await storage.updateAdminUser(adminId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      // Log admin user update
      await storage.logAdminActivity({
        adminId: req.superAdmin!.id,
        action: 'update_admin_user',
        targetType: 'admin_user',
        targetId: adminId,
        details: { 
          updates: Object.keys(updates),
          timestamp: new Date().toISOString()
        },
        ipAddress: req.ip || 'unknown',
      });

      // Remove password hash from response
      const { passwordHash: _, ...adminUserResponse } = updatedUser;
      res.json(adminUserResponse);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating admin user: " + error.message });
    }
  });

  // Delete admin user (super admin only)
  app.delete("/api/super-admin/admin-users/:id", requireSuperAdminAuth, async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      
      // Prevent super admin from deleting themselves
      if (adminId === req.superAdmin!.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const deleted = await storage.deleteAdminUser(adminId);
      if (!deleted) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      // Log admin user deletion
      await storage.logAdminActivity({
        adminId: req.superAdmin!.id,
        action: 'delete_admin_user',
        targetType: 'admin_user',
        targetId: adminId,
        details: { 
          timestamp: new Date().toISOString()
        },
        ipAddress: req.ip || 'unknown',
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting admin user: " + error.message });
    }
  });

  // Get admin activity logs (super admin only)
  app.get("/api/super-admin/activity-logs", requireSuperAdminAuth, async (req, res) => {
    try {
      const { adminId, action, targetType, limit } = req.query;
      
      const logs = await storage.getAdminActivityLogs({
        adminId: adminId ? parseInt(adminId as string) : undefined,
        action: action as string,
        targetType: targetType as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching activity logs: " + error.message });
    }
  });

  // =============================================================================
  // SEO ROUTES - Sitemap and robots.txt for search engine optimization
  // =============================================================================

  // Dynamic sitemap generation
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Get approved profiles for individual profile pages
      const profiles = await storage.getProfiles({ approved: true });
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/browse</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/help</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/safety</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/cookies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/report</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;

      // Add individual profile pages
      profiles.forEach(profile => {
        const profileDate = profile.updatedAt ? new Date(profile.updatedAt).toISOString().split('T')[0] : currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/profile/${profile.id}</loc>
    <lastmod>${profileDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      res.set('Content-Type', 'text/xml');
      res.send(sitemap);
    } catch (error: any) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Serve robots.txt
  app.get("/robots.txt", (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.sendFile(path.resolve(process.cwd(), 'robots.txt'));
  });

  const httpServer = createServer(app);
  return httpServer;
}
