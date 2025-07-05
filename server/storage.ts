import { users, profiles, orders, orderItems, type User, type InsertUser, type Profile, type InsertProfile, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, inArray } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
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
      .values([profile])
      .returning();
    return newProfile;
  }

  async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | undefined> {
    const [updated] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updated || undefined;
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
      .values([orderItem])
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
}

export const storage = new DatabaseStorage();
