import { pgTable, text, serial, integer, boolean, decimal, timestamp, json, varchar, index, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =============================================================================
// FRONT-END USER AUTHENTICATION SYSTEM
// =============================================================================

// Front-end users table - for regular site users (NOT admins)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isEmailVerified: boolean("is_email_verified").default(false),
  role: text("role").default("user").notNull(), // user, premium_user
  isActive: boolean("is_active").default(true),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  
  // SEO-friendly multilingual slugs
  slugEn: text("slug_en").unique(),
  slugEs: text("slug_es").unique(),
  slugDe: text("slug_de").unique(),
  slugIt: text("slug_it").unique(),
  slugNl: text("slug_nl").unique(),
  slugPt: text("slug_pt").unique(),
  
  // Profile Details
  education: text("education"),
  occupation: text("occupation"),
  occupationDetails: text("occupation_details"), // For specific occupation selection
  languages: text("languages").array(),
  relationshipStatus: text("relationship_status"),
  children: text("children").array(),
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
  combinedAgreement: boolean("combined_agreement").default(false),
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
  favorites: many(userFavorites),
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

// Removed old insertUserSchema - now defined in authentication section

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

// These types are defined later in the user authentication section
// to avoid duplicates and maintain proper organization

// =============================================================================
// ADMIN PANEL SCHEMA - Isolated admin functionality
// =============================================================================

// Admin users table - separate from regular users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "superadmin"] }).default("admin").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin activity log for security and auditing
export const adminActivityLog = pgTable("admin_activity_log", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => adminUsers.id), // Nullable for system logs
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

// Admin sessions for secure authentication
export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(), // session ID
  adminId: integer("admin_id").references(() => adminUsers.id).notNull(),
  type: text("type", { enum: ["admin", "superadmin"] }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin relations
export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  activityLogs: many(adminActivityLog),
  settingsUpdates: many(adminSettings),
  sessions: many(adminSessions),
}));

export const adminActivityLogRelations = relations(adminActivityLog, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [adminActivityLog.adminId],
    references: [adminUsers.id],
  }),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [adminSessions.adminId],
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

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  createdAt: true,
});

// Role type definitions for enhanced type safety
export const USER_ROLES = ["user", "premium_user"] as const;
export const ADMIN_ROLES = ["admin", "superadmin"] as const;

export type UserRole = typeof USER_ROLES[number];
export type AdminRole = typeof ADMIN_ROLES[number];

// Admin schema types with enhanced role validation
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminActivityLog = typeof adminActivityLog.$inferSelect;
export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;
export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;

// Enhanced admin user schema with role validation
export const createAdminUserSchema = insertAdminUserSchema.extend({
  role: z.enum(ADMIN_ROLES),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8), // For creation, not storage
});

// =============================================================================
// USER FAVORITES SYSTEM
// =============================================================================

// User sessions table for authentication
export const userSessions = pgTable("user_sessions", {
  id: text("id").primaryKey(), // session ID
  userId: integer("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User favorites table for tracking user favorite profiles (REQUIRES AUTHENTICATION)
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // Links to front-end users, NOT admin users
  profileId: integer("profile_id").references(() => profiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  // Unique constraint to prevent duplicate favorites
  unique("unique_user_profile_favorite").on(table.userId, table.profileId),
]);

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
  sessions: many(userSessions),
}));

// User sessions relations  
export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

// User favorites relations
export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  profile: one(profiles, {
    fields: [userFavorites.profileId],
    references: [profiles.id],
  }),
}));

// profiles relations updated above to include favorites

// =============================================================================
// SCHEMA TYPES FOR AUTHENTICATION AND FAVORITES
// =============================================================================

// User schema types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  registrationDate: true,
  lastLogin: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

// Internal type for storing users with hashed passwords
export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  passwordHash: z.string(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

// User session schema types
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  createdAt: true,
});

// User favorites schema types
export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

// All platform type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

// Profile and order types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
