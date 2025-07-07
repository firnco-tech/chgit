import { Request, Response, NextFunction } from 'express';
import { AdminRole, UserRole } from '@shared/schema';
import { storage } from './storage';

// Extend Request interface to include authenticated user data
declare global {
  namespace Express {
    interface Request {
      superAdmin?: {
        id: number;
        username: string;
        email: string;
        role: AdminRole;
      };
      admin?: {
        id: number;
        username: string;
        email: string;
        role: AdminRole;
      };
      user?: {
        id: number;
        username: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

// =============================================================================
// ROLE-BASED AUTHORIZATION MIDDLEWARE
// =============================================================================

/**
 * Middleware to require specific admin roles
 * @param allowedRoles - Array of admin roles that can access the route
 * @param requireSuperAdmin - If true, only super admins can access
 */
export function requireAdminRole(
  allowedRoles: AdminRole[] = ['admin', 'superadmin'],
  requireSuperAdmin: boolean = false
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for super admin authentication first
      const superAdminSessionId = req.cookies?.superAdminSession;
      console.log('🔍 SUPER ADMIN SESSION DEBUG:', {
        path: req.path,
        method: req.method,
        cookiesReceived: Object.keys(req.cookies || {}),
        superAdminSessionId: superAdminSessionId ? `${superAdminSessionId.substring(0, 10)}...` : 'NOT_FOUND',
        requireSuperAdmin,
        allowedRoles
      });
      
      if (superAdminSessionId && (requireSuperAdmin || allowedRoles.includes('superadmin'))) {
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
        const superAdminSession = await storage.getAdminSession(superAdminSessionId);
        console.log('📋 SUPER ADMIN SESSION LOOKUP:', {
          sessionFound: !!superAdminSession,
          expired: superAdminSession ? superAdminSession.expiresAt <= new Date() : 'N/A',
          sessionType: superAdminSession?.type || 'N/A',
          adminId: superAdminSession?.adminId || 'N/A'
        });
        
        if (superAdminSession && superAdminSession.expiresAt > new Date()) {
          const superAdmin = await storage.getAdminUser(superAdminSession.adminId);
          console.log('👤 SUPER ADMIN USER LOOKUP:', {
            userFound: !!superAdmin,
            userRole: superAdmin?.role || 'N/A',
            userId: superAdmin?.id || 'N/A'
          });
          
          if (superAdmin && superAdmin.role === 'superadmin') {
            req.superAdmin = {
              id: superAdmin.id,
              username: superAdmin.username,
              email: superAdmin.email,
              role: superAdmin.role
            };
            
            console.log('✅ SUPER ADMIN AUTHENTICATED - CALLING NEXT()');
            
            // Log super admin access
            await storage.logAdminActivity({
              adminId: superAdmin.id,
              action: 'route_access',
              targetType: 'api_endpoint',
              targetId: null,
              details: JSON.stringify({
                route: req.path,
                method: req.method,
                ip: ipAddress,
                userAgent: req.get('User-Agent') || 'unknown'
              })
            });
            
            return next();
          } else {
            console.log('❌ SUPER ADMIN VALIDATION FAILED:', {
              userExists: !!superAdmin,
              actualRole: superAdmin?.role || 'N/A',
              expectedRole: 'superadmin'
            });
          }
        }
      }
      
      // Check for regular admin authentication if super admin not found
      if (!requireSuperAdmin && allowedRoles.includes('admin')) {
        // Check for admin session with enhanced debugging - check both cookie types
        const adminSessionId = req.cookies?.adminSession || req.cookies?.superAdminSession;
        console.log('🔍 ADMIN SESSION DEBUG:', {
          path: req.path,
          method: req.method,
          cookiesReceived: Object.keys(req.cookies || {}),
          adminSessionId: adminSessionId ? `${adminSessionId.substring(0, 10)}...` : 'NOT_FOUND',
          foundInCookie: req.cookies?.adminSession ? 'adminSession' : req.cookies?.superAdminSession ? 'superAdminSession' : 'NONE'
        });
        
        if (adminSessionId) {
          const adminSession = await storage.getAdminSession(adminSessionId);
          console.log('📋 SESSION LOOKUP:', {
            sessionFound: !!adminSession,
            expired: adminSession ? adminSession.expiresAt <= new Date() : 'N/A',
            sessionType: adminSession?.type || 'N/A'
          });
          
          if (adminSession && adminSession.expiresAt > new Date()) {
            const admin = await storage.getAdminUser(adminSession.adminId);
            
            if (admin && (admin.role === 'admin' || admin.role === 'superadmin')) {
              // Set the appropriate request object based on role
              if (admin.role === 'superadmin') {
                req.superAdmin = {
                  id: admin.id,
                  username: admin.username,
                  email: admin.email,
                  role: admin.role
                };
              } else {
                req.admin = {
                  id: admin.id,
                  username: admin.username,
                  email: admin.email,
                  role: admin.role
                };
              }
              
              // Log admin access
              await storage.logAdminActivity({
                adminId: admin.id,
                action: 'route_access',
                targetType: 'api_endpoint',
                targetId: null,
                details: JSON.stringify({
                  route: req.path,
                  method: req.method,
                  ip: req.ip || 'unknown',
                  userAgent: req.get('User-Agent') || 'unknown'
                })
              });
              
              return next();
            }
          }
        }
      }
      
      // No valid authentication found
      return res.status(403).json({ 
        message: "Insufficient permissions",
        requiredRole: requireSuperAdmin ? 'superadmin' : allowedRoles,
        requiresLogin: true 
      });
      
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return res.status(500).json({ 
        message: "Authorization check failed",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
}

/**
 * Middleware to require super admin access only
 */
export const requireSuperAdmin = requireAdminRole(['superadmin'], true);

/**
 * Middleware to require admin or super admin access
 */
export const requireAdmin = requireAdminRole(['admin', 'superadmin'], false);

// =============================================================================
// RESOURCE-BASED AUTHORIZATION MIDDLEWARE
// =============================================================================

/**
 * Middleware to check if user can access specific resources
 * @param resourceType - Type of resource (profile, order, user, etc.)
 * @param getResourceId - Function to extract resource ID from request
 * @param permissions - Required permissions for the resource
 */
export function requireResourceAccess(
  resourceType: 'profile' | 'order' | 'user' | 'admin_user',
  getResourceId: (req: Request) => number | string,
  permissions: {
    read?: boolean;
    write?: boolean;
    delete?: boolean;
    admin?: boolean;
  } = { read: true }
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = getResourceId(req);
      const currentUser = req.superAdmin || req.admin || req.user;
      
      if (!currentUser) {
        return res.status(401).json({ 
          message: "Authentication required",
          requiresLogin: true 
        });
      }
      
      // Super admins have access to all resources
      if (req.superAdmin) {
        return next();
      }
      
      // Admin users have access to most resources
      if (req.admin && permissions.admin !== false) {
        return next();
      }
      
      // Regular users can only access their own resources
      if (req.user) {
        // Check if user is accessing their own resource
        if (resourceType === 'user' && currentUser.id === resourceId) {
          return next();
        }
        
        // Check if user owns the resource (for orders, favorites, etc.)
        if (resourceType === 'order') {
          const order = await storage.getOrder(Number(resourceId));
          if (order && order.userId === currentUser.id) {
            return next();
          }
        }
        
        // For other resources, deny access unless explicitly allowed
        return res.status(403).json({ 
          message: "Access denied to this resource",
          resourceType,
          resourceId 
        });
      }
      
      return res.status(403).json({ 
        message: "Insufficient permissions for this resource",
        resourceType,
        resourceId 
      });
      
    } catch (error) {
      console.error('Resource authorization error:', error);
      return res.status(500).json({ 
        message: "Resource authorization check failed",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
}

// =============================================================================
// AUDIT LOGGING MIDDLEWARE
// =============================================================================

/**
 * Middleware to log all administrative actions
 */
export function auditLog(
  action: string,
  targetType: string,
  getTargetId?: (req: Request) => number | null
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentAdmin = req.superAdmin || req.admin;
      
      if (currentAdmin) {
        const targetId = getTargetId ? getTargetId(req) : null;
        
        await storage.logAdminActivity({
          adminId: currentAdmin.id,
          action,
          targetType,
          targetId,
          details: JSON.stringify({
            route: req.path,
            method: req.method,
            body: req.method !== 'GET' ? req.body : undefined,
            query: req.query,
            ip: req.ip || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown'
          })
        });
      }
      
      next();
    } catch (error) {
      console.error('Audit logging error:', error);
      // Continue with request even if logging fails
      next();
    }
  };
}

// =============================================================================
// PERMISSION HELPERS
// =============================================================================

/**
 * Check if current user has specific permission
 */
export function hasPermission(
  req: Request,
  permission: 'read' | 'write' | 'delete' | 'admin' | 'superadmin'
): boolean {
  if (req.superAdmin) return true;
  
  if (req.admin) {
    return permission !== 'superadmin';
  }
  
  if (req.user) {
    return permission === 'read';
  }
  
  return false;
}

/**
 * Get current authenticated user (any type)
 */
export function getCurrentUser(req: Request): {
  id: number;
  username: string;
  email: string;
  role: AdminRole | UserRole;
  type: 'superadmin' | 'admin' | 'user';
} | null {
  if (req.superAdmin) {
    return { ...req.superAdmin, type: 'superadmin' };
  }
  
  if (req.admin) {
    return { ...req.admin, type: 'admin' };
  }
  
  if (req.user) {
    return { ...req.user, type: 'user' };
  }
  
  return null;
}