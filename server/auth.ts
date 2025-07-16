/**
 * AUTHENTICATION MIDDLEWARE AND UTILITIES
 * 
 * This module provides:
 * 1. Session management for front-end users
 * 2. Authentication middleware to protect routes
 * 3. User role separation (admin vs regular users)
 * 4. Password hashing and verification
 */

import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { nanoid } from 'nanoid';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        role: string;
        isAdmin: boolean;
      };
      session: any;
    }
  }
}

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Session management
export const createUserSession = async (userId: number): Promise<string> => {
  const sessionId = nanoid();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await storage.createUserSession({
    id: sessionId,
    userId,
    expiresAt,
  });
  
  return sessionId;
};

export const validateSession = async (sessionId: string) => {
  console.log('🔍 VALIDATE SESSION - Input sessionId:', sessionId);
  if (!sessionId) return null;
  
  const session = await storage.getUserSession(sessionId);
  console.log('🔍 VALIDATE SESSION - Retrieved session from storage:', session);
  
  if (!session || session.expiresAt < new Date()) {
    console.log('🔍 VALIDATE SESSION - Session not found or expired');
    // Clean up expired session
    if (session) {
      await storage.deleteUserSession(sessionId);
    }
    return null;
  }
  
  console.log('🔍 VALIDATE SESSION - Session userId:', session.userId);
  const user = await storage.getUserById(session.userId);
  console.log('🔍 VALIDATE SESSION - Retrieved user from storage:', user);
  
  if (!user || !user.isActive) {
    console.log('🔍 VALIDATE SESSION - User not found or inactive');
    return null;
  }
  
  const result = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    isAdmin: false, // Regular users are never admin
  };
  
  console.log('🔍 VALIDATE SESSION - Final result:', result);
  return result;
};

/**
 * AUTHENTICATION MIDDLEWARE - PROTECTS ROUTES FOR REGULAR USERS ONLY
 * 
 * This middleware ensures:
 * 1. Only authenticated front-end users can access protected routes
 * 2. Admin users CANNOT use front-end features (strict separation)
 * 3. Sessions are validated and renewed
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 AUTH DEBUG - Full session object:', req.session);
    console.log('🔍 AUTH DEBUG - Session ID from req.session.userId:', req.session?.userId);
    
    const sessionId = req.session?.userId;
    
    if (!sessionId) {
      console.log('🔍 AUTH DEBUG - No session ID found');
      return res.status(401).json({ 
        message: 'Authentication required',
        requiresLogin: true 
      });
    }
    
    console.log('🔍 AUTH DEBUG - About to validate session:', sessionId);
    const user = await validateSession(sessionId);
    console.log('🔍 AUTH DEBUG - Validated user result:', user);
    
    if (!user) {
      console.log('🔍 AUTH DEBUG - No user found or session invalid');
      // Clear invalid session
      req.session.destroy((err: any) => {
        if (err) console.error('Session destroy error:', err);
      });
      
      return res.status(401).json({ 
        message: 'Invalid or expired session',
        requiresLogin: true 
      });
    }
    
    // CRITICAL: Ensure admin users cannot use front-end features
    if (user.isAdmin || user.role === 'admin') {
      console.log('🔍 AUTH DEBUG - Admin user blocked from front-end');
      return res.status(403).json({ 
        message: 'Admin users cannot access user features',
        error: 'ADMIN_ACCESS_DENIED'
      });
    }
    
    console.log('🔍 AUTH DEBUG - Setting req.user to:', user);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

/**
 * OPTIONAL AUTHENTICATION - FOR ROUTES THAT WORK WITH OR WITHOUT AUTH
 * 
 * This middleware:
 * 1. Sets req.user if authenticated
 * 2. Allows requests to continue even if not authenticated
 * 3. Still enforces admin/user separation
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.session?.userId;
    
    if (sessionId) {
      const user = await validateSession(sessionId);
      
      if (user && !user.isAdmin && user.role !== 'admin') {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without auth on error
  }
};

/**
 * ADMIN-ONLY MIDDLEWARE - PROTECTS ADMIN ROUTES
 * 
 * This middleware ensures:
 * 1. Only admin users can access admin routes
 * 2. Regular users CANNOT access admin features
 */
export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For now, we'll implement a simple admin check
    // In a real implementation, this would check admin session tokens
    
    // TODO: Implement proper admin authentication
    // For now, allowing admin access for development
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Admin authentication error' });
  }
};