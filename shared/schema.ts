import { pgTable, text, serial, integer, boolean, decimal, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  height: text("height"),
  location: text("location").notNull(),
  
  // Profile Details
  education: text("education"),
  occupation: text("occupation"),
  occupationDetails: text("occupation_details"), // For specific occupation selection
  languages: text("languages").array(),
  relationshipStatus: text("relationship_status"),
  children: text("children"),
  smoking: text("smoking"),
  bodyType: text("body_type"),
  appearance: text("appearance"),
  drinking: text("drinking"),
  lookingFor: text("looking_for").array(),
  aboutMe: text("about_me"),
  interests: text("interests").array(),
  
  // Media
  photos: text("photos").array(),
  videos: text("videos").array(),
  primaryPhoto: text("primary_photo"),
  inactivePhotos: text("inactive_photos").array().default([]),
  inactiveVideos: text("inactive_videos").array().default([]),
  
  // Contact Methods - stored as JSON with all possible contact methods
  contactMethods: json("contact_methods"),
  
  // Terms and Agreements
  ageConfirmation: boolean("age_confirmation").default(false),
  termsAccepted: boolean("terms_accepted").default(false),
  reviewConsent: boolean("review_consent").default(false),
  contactSharingConsent: boolean("contact_sharing_consent").default(false),
  
  // System fields
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("2.00"),
  status: text("status").notNull().default("PENDING"), // PENDING, ACTIVE, INACTIVE
  isApproved: boolean("is_approved").default(false), // Keep for backward compatibility
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  profileId: integer("profile_id").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  contactInfo: json("contact_info"),
});

export const profilesRelations = relations(profiles, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  profile: one(profiles, {
    fields: [orderItems.profileId],
    references: [profiles.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isApproved: true,
  isFeatured: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// =============================================================================
// ADMIN PANEL SCHEMA - Isolated admin functionality
// =============================================================================

// Admin users table - separate from regular users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin").notNull(), // admin, super_admin
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin activity log for security and auditing
export const adminActivityLog = pgTable("admin_activity_log", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => adminUsers.id).notNull(),
  action: text("action").notNull(), // profile_approved, profile_rejected, user_blocked, etc.
  targetType: text("target_type").notNull(), // profile, user, order, etc.
  targetId: integer("target_id").notNull(),
  details: json("details"), // Additional context about the action
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Admin settings for platform configuration
export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: integer("updated_by").references(() => adminUsers.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin relations
export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  activityLogs: many(adminActivityLog),
  settingsUpdates: many(adminSettings),
}));

export const adminActivityLogRelations = relations(adminActivityLog, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [adminActivityLog.adminId],
    references: [adminUsers.id],
  }),
}));

// Admin schema types
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminActivityLogSchema = createInsertSchema(adminActivityLog).omit({
  id: true,
  timestamp: true,
});

export const insertAdminSettingsSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminActivityLog = typeof adminActivityLog.$inferSelect;
export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;
export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;
