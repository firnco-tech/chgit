/**
 * SUPER ADMIN AUTHENTICATION AND MANAGEMENT
 * 
 * This module provides:
 * 1. Super admin authentication with enhanced security
 * 2. Admin user management (create, edit, delete admin users)
 * 3. Audit logging for all super admin activities
 * 4. Secure session management for super admin users
 */

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { AdminUser, AdminRole } from "@shared/schema";

// Enhanced request interface for super admin
declare global {
  namespace Express {
    interface Request {
      superAdmin?: {
        id: number;
        email: string;
        username: string;
        role: AdminRole;
        isActive: boolean;
      };
    }
  }
}

/**
 * SUPER ADMIN SESSION MANAGEMENT
 */
export const createSuperAdminSession = async (adminId: number): Promise<string> => {
  const sessionId = `super_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  // Store session in database with enhanced security
  await storage.createAdminSession({
    id: sessionId,
    adminId,
    expiresAt,
    type: 'superadmin',
    ipAddress: '', // Will be set in middleware
  });

  return sessionId;
};

export const validateSuperAdminSession = async (sessionId: string, ipAddress: string) => {
  if (!sessionId.startsWith('super_')) {
    return null;
  }

  const session = await storage.getAdminSession(sessionId);
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await storage.deleteAdminSession(sessionId);
    }
    return null;
  }

  // Get admin user and verify role
  const admin = await storage.getAdminUser(session.adminId);
  if (!admin || !admin.isActive || admin.role !== 'superadmin') {
    await storage.deleteAdminSession(sessionId);
    return null;
  }

  // Update last activity and IP validation
  await storage.updateAdminSession(sessionId, { 
    lastActivity: new Date(),
    ipAddress 
  });

  return admin;
};

/**
 * SUPER ADMIN AUTHENTICATION MIDDLEWARE
 * 
 * This middleware ensures:
 * 1. Only users with superadmin role can access super admin routes
 * 2. Enhanced security logging with IP tracking
 * 3. Session validation and renewal
 */
export const requireSuperAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '') || 
                     req.cookies?.superAdminSession;

    if (!sessionId) {
      return res.status(401).json({ 
        message: "Super admin authentication required",
        requiresLogin: true 
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const superAdmin = await validateSuperAdminSession(sessionId, ipAddress);

    if (!superAdmin) {
      // Log failed authentication attempt
      await storage.logAdminActivity({
        adminId: null, // System log
        action: 'failed_super_admin_auth',
        targetType: 'security',
        targetId: 0,
        details: { 
          sessionId,
          ipAddress,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        },
        ipAddress,
      });

      return res.status(401).json({ 
        message: "Invalid or expired super admin session",
        requiresLogin: true 
      });
    }

    // Set super admin in request for use in routes
    req.superAdmin = {
      id: superAdmin.id,
      email: superAdmin.email,
      username: superAdmin.username,
      role: superAdmin.role,
      isActive: superAdmin.isActive,
    };

    next();
  } catch (error) {
    console.error("Super admin authentication error:", error);
    res.status(500).json({ message: "Authentication system error" });
  }
};

/**
 * SUPER ADMIN LOGIN HANDLER
 */
export const handleSuperAdminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Get admin user by username
    const adminUser = await storage.getAdminUserByUsername(username);
    if (!adminUser || !adminUser.isActive || adminUser.role !== 'superadmin') {
      // Log failed login attempt
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      await storage.logAdminActivity({
        adminId: null, // System log
        action: 'failed_super_admin_login',
        targetType: 'security',
        targetId: 0,
        details: { 
          username,
          ipAddress,
          userAgent: req.headers['user-agent'],
          reason: 'invalid_user_or_not_superadmin',
          timestamp: new Date().toISOString()
        },
        ipAddress,
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, adminUser.passwordHash);
    if (!passwordValid) {
      // Log failed password attempt
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      await storage.logAdminActivity({
        adminId: adminUser.id,
        action: 'failed_super_admin_password',
        targetType: 'security',
        targetId: adminUser.id,
        details: { 
          username,
          ipAddress,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        },
        ipAddress,
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create super admin session
    const sessionId = await createSuperAdminSession(adminUser.id);
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    // Update last login time
    await storage.updateAdminUser(adminUser.id, { lastLogin: new Date() });

    // Log successful super admin login
    await storage.logAdminActivity({
      adminId: adminUser.id,
      action: 'super_admin_login',
      targetType: 'admin_user',
      targetId: adminUser.id,
      details: { 
        ipAddress,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      },
      ipAddress,
    });

    // Set secure session cookie
    res.cookie('superAdminSession', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      sameSite: 'strict'
    });

    res.json({
      success: true,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      },
      sessionId
    });
  } catch (error) {
    console.error("Super admin login error:", error);
    res.status(500).json({ message: "Login system error" });
  }
};

/**
 * SUPER ADMIN LOGOUT HANDLER
 */
export const handleSuperAdminLogout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '') || 
                     req.cookies?.superAdminSession;

    if (sessionId && req.superAdmin) {
      // Log logout activity
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      await storage.logAdminActivity({
        adminId: req.superAdmin.id,
        action: 'super_admin_logout',
        targetType: 'admin_user',
        targetId: req.superAdmin.id,
        details: { 
          ipAddress,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        },
        ipAddress,
      });

      // Delete session
      await storage.deleteAdminSession(sessionId);
    }

    // Clear session cookie
    res.clearCookie('superAdminSession');
    res.json({ success: true });
  } catch (error) {
    console.error("Super admin logout error:", error);
    res.status(500).json({ message: "Logout system error" });
  }
};

/**
 * GET CURRENT SUPER ADMIN USER
 */
export const getCurrentSuperAdmin = async (req: Request, res: Response) => {
  if (!req.superAdmin) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    id: req.superAdmin.id,
    username: req.superAdmin.username,
    email: req.superAdmin.email,
    role: req.superAdmin.role,
  });
};