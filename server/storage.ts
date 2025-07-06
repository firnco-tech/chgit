import { 
  users, 
  profiles, 
  orders, 
  orderItems,
  // Admin tables
  adminUsers,
  adminActivityLog,
  adminSettings,
  // User system
  userFavorites,
  userSessions,
  type User, 
  type InsertUser,
  type RegisterUser,
  type Profile, 
  type InsertProfile, 
  type Order, 
  type InsertOrder, 
  type OrderItem, 
  type InsertOrderItem,
  // Admin types
  type AdminUser,
  type InsertAdminUser,
  type AdminActivityLog,
  type InsertAdminActivityLog,
  type AdminSettings,
  type InsertAdminSettings,
  // User system types
  type UserFavorite,
  type InsertUserFavorite,
  type UserSession,
  type InsertUserSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, inArray, sql } from "drizzle-orm";

export interface IStorage {
  // =============================================================================
  // FRONT-END USER AUTHENTICATION METHODS - For regular site users
  // =============================================================================
  
  // User account management
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: RegisterUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Session management
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSession(sessionId: string): Promise<UserSession | undefined>;
  deleteUserSession(sessionId: string): Promise<boolean>;
  cleanupExpiredSessions(): Promise<void>;
  
  // Legacy user methods (for backward compatibility)
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: number): Promise<Profile | undefined>;
  getProfiles(filters?: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    contactMethods?: string[];
    approved?: boolean;
    featured?: boolean;
  }): Promise<Profile[]>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | undefined>;
  approveProfile(id: number): Promise<Profile | undefined>;
  searchProfiles(query: string): Promise<Profile[]>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByPaymentIntent(paymentIntentId: string): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item methods
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  getOrderItemsWithProfiles(orderId: number): Promise<(OrderItem & { profile: Profile })[]>;

  // =============================================================================
  // ADMIN PANEL METHODS - Isolated admin functionality
  // =============================================================================
  
  // Admin user management
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, user: Partial<AdminUser>): Promise<AdminUser | undefined>;
  deleteAdminUser(id: number): Promise<boolean>;
  getAllAdminUsers(): Promise<AdminUser[]>;
  
  // Admin activity logging
  logAdminActivity(log: InsertAdminActivityLog): Promise<AdminActivityLog>;
  getAdminActivityLogs(filters?: {
    adminId?: number;
    action?: string;
    targetType?: string;
    limit?: number;
  }): Promise<AdminActivityLog[]>;
  
  // Admin settings
  getAdminSettings(): Promise<AdminSettings[]>;
  getAdminSetting(key: string): Promise<AdminSettings | undefined>;
  updateAdminSetting(key: string, value: string, updatedBy: number): Promise<AdminSettings>;
  
  // Admin profile management (extends existing profile methods)
  getProfilesForAdmin(filters?: {
    approved?: boolean;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Profile[]>;
  getProfileCountByStatus(): Promise<{ approved: number; pending: number; total: number }>;
  
  // Admin order management
  getOrdersForAdmin(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]>;
  getOrderStats(): Promise<{ total: number; completed: number; pending: number; revenue: number }>;
  
  // =============================================================================
  // USER FAVORITES METHODS
  // =============================================================================
  
  // User favorites management
  addUserFavorite(userId: number, profileId: number): Promise<UserFavorite>;
  removeUserFavorite(userId: number, profileId: number): Promise<boolean>;
  getUserFavorites(userId: number): Promise<Profile[]>;
  isProfileFavorited(userId: number, profileId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // =============================================================================
  // FRONT-END USER AUTHENTICATION METHODS IMPLEMENTATION
  // =============================================================================
  
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: RegisterUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values({
        email: user.email,
        username: user.username,
        passwordHash: user.password, // This will be hashed by auth layer
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'user',
        isActive: true,
      })
      .returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // Session management
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [newSession] = await db
      .insert(userSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getUserSession(sessionId: string): Promise<UserSession | undefined> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId));
    return session || undefined;
  }

  async deleteUserSession(sessionId: string): Promise<boolean> {
    const result = await db
      .delete(userSessions)
      .where(eq(userSessions.id, sessionId));
    return result.rowCount > 0;
  }

  async cleanupExpiredSessions(): Promise<void> {
    await db
      .delete(userSessions)
      .where(sql`${userSessions.expiresAt} < now()`);
  }

  // Legacy user methods (for backward compatibility)
  async getUser(id: number): Promise<User | undefined> {
    return this.getUserById(id);
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async getProfiles(filters?: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    contactMethods?: string[];
    approved?: boolean;
    featured?: boolean;
  }): Promise<Profile[]> {
    const conditions = [];
    
    if (filters?.approved !== undefined) {
      conditions.push(eq(profiles.isApproved, filters.approved));
    }
    
    if (filters?.featured !== undefined) {
      conditions.push(eq(profiles.isFeatured, filters.featured));
    }
    
    if (filters?.ageMin) {
      conditions.push(eq(profiles.age, filters.ageMin)); // This would need proper comparison
    }
    
    if (filters?.location) {
      conditions.push(eq(profiles.location, filters.location));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(profiles)
        .where(and(...conditions))
        .orderBy(desc(profiles.createdAt));
    }
    
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values([profile as any])
      .returning();
    return newProfile;
  }

  async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | undefined> {
    console.log(`Updating profile ${id} in database with:`, profile);
    try {
      const [updated] = await db
        .update(profiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(profiles.id, id))
        .returning();
      console.log('Database update result:', updated);
      return updated || undefined;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  async approveProfile(id: number): Promise<Profile | undefined> {
    const [approved] = await db
      .update(profiles)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return approved || undefined;
  }

  async searchProfiles(query: string): Promise<Profile[]> {
    return await db
      .select()
      .from(profiles)
      .where(
        and(
          eq(profiles.isApproved, true),
          or(
            ilike(profiles.firstName, `%${query}%`),
            ilike(profiles.location, `%${query}%`),
            ilike(profiles.aboutMe, `%${query}%`)
          )
        )
      )
      .orderBy(desc(profiles.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderByPaymentIntent(paymentIntentId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, paymentIntentId));
    return order || undefined;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db
      .insert(orderItems)
      .values([orderItem as any])
      .returning();
    return newOrderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async getOrderItemsWithProfiles(orderId: number): Promise<(OrderItem & { profile: Profile })[]> {
    return await db
      .select()
      .from(orderItems)
      .leftJoin(profiles, eq(orderItems.profileId, profiles.id))
      .where(eq(orderItems.orderId, orderId))
      .then(results => 
        results.map(row => ({
          ...row.order_items,
          profile: row.profiles!
        }))
      );
  }

  // =============================================================================
  // ADMIN PANEL METHODS IMPLEMENTATION - Isolated admin functionality
  // =============================================================================
  
  // Admin user management
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db.insert(adminUsers).values(user).returning();
    return newUser;
  }

  async updateAdminUser(id: number, user: Partial<AdminUser>): Promise<AdminUser | undefined> {
    const [updatedUser] = await db
      .update(adminUsers)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    const result = await db.delete(adminUsers).where(eq(adminUsers.id, id));
    return result.rowCount > 0;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(adminUsers.createdAt);
  }

  // Admin activity logging
  async logAdminActivity(log: InsertAdminActivityLog): Promise<AdminActivityLog> {
    const [newLog] = await db.insert(adminActivityLog).values(log).returning();
    return newLog;
  }

  async getAdminActivityLogs(filters?: {
    adminId?: number;
    action?: string;
    targetType?: string;
    limit?: number;
  }): Promise<AdminActivityLog[]> {
    let query = db.select().from(adminActivityLog);
    
    if (filters?.adminId) {
      query = query.where(eq(adminActivityLog.adminId, filters.adminId));
    }
    if (filters?.action) {
      query = query.where(eq(adminActivityLog.action, filters.action));
    }
    if (filters?.targetType) {
      query = query.where(eq(adminActivityLog.targetType, filters.targetType));
    }
    
    query = query.orderBy(desc(adminActivityLog.timestamp));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    return await query;
  }

  // Admin settings
  async getAdminSettings(): Promise<AdminSettings[]> {
    return await db.select().from(adminSettings).orderBy(adminSettings.key);
  }

  async getAdminSetting(key: string): Promise<AdminSettings | undefined> {
    const [setting] = await db.select().from(adminSettings).where(eq(adminSettings.key, key));
    return setting || undefined;
  }

  async updateAdminSetting(key: string, value: string, updatedBy: number): Promise<AdminSettings> {
    const [setting] = await db
      .insert(adminSettings)
      .values({ key, value, updatedBy })
      .onConflictDoUpdate({
        target: adminSettings.key,
        set: { value, updatedBy, updatedAt: new Date() }
      })
      .returning();
    return setting;
  }

  // Admin profile management (extends existing profile methods)
  async getProfilesForAdmin(filters?: {
    approved?: boolean;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Profile[]> {
    let query = db.select().from(profiles);
    
    if (filters?.approved !== undefined) {
      query = query.where(eq(profiles.isApproved, filters.approved));
    }
    if (filters?.featured !== undefined) {
      query = query.where(eq(profiles.isFeatured, filters.featured));
    }
    
    query = query.orderBy(desc(profiles.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getProfileCountByStatus(): Promise<{ approved: number; pending: number; total: number }> {
    const [approvedCount] = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.isApproved, true));
    const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.isApproved, false));
    const [totalCount] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
    
    return {
      approved: approvedCount.count,
      pending: pendingCount.count,
      total: totalCount.count
    };
  }

  // Admin order management
  async getOrdersForAdmin(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (filters?.status) {
      query = query.where(eq(orders.status, filters.status));
    }
    
    query = query.orderBy(desc(orders.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getOrderStats(): Promise<{ total: number; completed: number; pending: number; revenue: number }> {
    const [totalOrders] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const [completedOrders] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'completed'));
    const [pendingOrders] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'pending'));
    const [revenue] = await db.select({ sum: sql<number>`sum(total_amount)` }).from(orders).where(eq(orders.status, 'completed'));
    
    return {
      total: totalOrders.count,
      completed: completedOrders.count,
      pending: pendingOrders.count,
      revenue: parseFloat(revenue.sum || "0")
    };
  }

  // =============================================================================
  // USER FAVORITES METHODS IMPLEMENTATION
  // =============================================================================

  async addUserFavorite(userId: number, profileId: number): Promise<UserFavorite> {
    const [favorite] = await db
      .insert(userFavorites)
      .values({
        userId,
        profileId,
      })
      .onConflictDoNothing()
      .returning();
    return favorite;
  }

  async removeUserFavorite(userId: number, profileId: number): Promise<boolean> {
    const result = await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.profileId, profileId)
        )
      );
    return result.rowCount > 0;
  }

  async getUserFavorites(userId: number): Promise<Profile[]> {
    const favoriteProfiles = await db
      .select({
        profile: profiles,
      })
      .from(userFavorites)
      .innerJoin(profiles, eq(userFavorites.profileId, profiles.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
    
    return favoriteProfiles.map(item => item.profile);
  }

  async isProfileFavorited(userId: number, profileId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.profileId, profileId)
        )
      )
      .limit(1);
    
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
