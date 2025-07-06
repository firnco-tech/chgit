import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { requireAuth, requireAdminAuth, hashPassword, verifyPassword, createUserSession } from "./auth";
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

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  // Get individual profile
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
      
      if (!amount || !profileIds || !customerEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          customerEmail,
          profileIds: JSON.stringify(profileIds),
        },
      });

      // Create order
      const order = await storage.createOrder({
        customerEmail,
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

  // Handle payment success and deliver contact info
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID required" });
      }

      // Get the payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not successful" });
      }

      // Find the order
      const order = await storage.getOrderByPaymentIntent(paymentIntentId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order status
      await storage.updateOrderStatus(order.id, "completed");

      // Get profile IDs from metadata
      const profileIds = JSON.parse(paymentIntent.metadata.profileIds || "[]");
      
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
  app.get("/api/admin/dashboard-stats", requireAdminAuth, async (req, res) => {
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
  app.get("/api/admin/recent-profiles", requireAdminAuth, async (req, res) => {
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
  app.get("/api/admin/profiles/:id", requireAdminAuth, async (req, res) => {
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
  app.patch("/api/admin/profiles/:id", requireAdminAuth, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
