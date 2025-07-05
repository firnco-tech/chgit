import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertProfileSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
