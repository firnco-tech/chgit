# Role-Based Access Control (RBAC) Design Document

## Overview
This document defines the three distinct user roles for the HolaCupid platform and their permissions structure for secure deployment-ready access control.

## User Role Definitions

### 1. Super Admin (`superadmin`)
**Complete system control and administrative oversight**

**Permissions:**
- Full access to all site functionality and settings
- Create, edit, and delete admin users
- View and manage all admin activity logs
- Modify site-wide settings and configuration
- Access super admin dashboard
- All admin panel permissions (inherited)
- All front-end user permissions (for testing/support)

**Access Restrictions:**
- Must authenticate through secure super admin login
- Actions are logged for security audit trails
- Cannot be created through regular registration flows

### 2. Admin (`admin`)
**Content and user management with restricted administrative access**

**Permissions:**
- Access admin panel dashboard
- Approve/reject profile submissions
- Manage user profiles (view, edit, approve, feature)
- View and manage orders and transactions
- View user analytics and statistics
- Manage profile media (photos/videos)
- View admin activity logs (own actions only)
- Block/unblock front-end users

**Access Restrictions:**
- Cannot create new admin users
- Cannot access super admin features
- Cannot modify site-wide settings
- Cannot view other admin users' detailed information
- Must authenticate through admin login

### 3. Front-End User (`user`)
**Standard site users with shopping and profile management capabilities**

**Permissions:**
- Browse profiles and featured content
- Create user account and login
- Add profiles to favorites
- Manage personal shopping cart
- Complete purchases through Stripe checkout
- Submit profile for review (if applicable)
- View purchase history
- Update personal account information

**Access Restrictions:**
- Cannot access admin panel
- Cannot access super admin features
- Cannot approve profiles or manage other users
- Cannot view administrative data or logs

## Database Schema Updates

### Current Schema Status
✅ **Users Table** (`users`): Already has `role` field with default "user"
✅ **Admin Users Table** (`adminUsers`): Already has `role` field with default "admin"

### Required Updates
1. **Admin Users Role Field**: Update to support "superadmin" value
2. **Role Validation**: Add schema validation for allowed role values
3. **Migration**: Ensure existing admin users have proper role assignments

### Role Enum Values
```typescript
// Front-end users (users table)
type UserRole = "user" | "premium_user";

// Admin users (adminUsers table) 
type AdminRole = "admin" | "superadmin";
```

## Access Control Matrix

| Feature | Super Admin | Admin | Front-End User |
|---------|-------------|-------|----------------|
| Super Admin Dashboard | ✅ | ❌ | ❌ |
| Create Admin Users | ✅ | ❌ | ❌ |
| Manage Admin Users | ✅ | ❌ | ❌ |
| View All Admin Logs | ✅ | Own Only | ❌ |
| Site Settings | ✅ | ❌ | ❌ |
| Admin Dashboard | ✅ | ✅ | ❌ |
| Approve Profiles | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |
| Browse Profiles | ✅ | ✅ | ✅ |
| Manage Favorites | ✅ | ✅ | ✅ |
| Shopping Cart | ✅ | ✅ | ✅ |
| Checkout | ✅ | ✅ | ✅ |

## Authentication Flow Design

### Super Admin Authentication
- Separate login endpoint: `/api/super-admin/login`
- Enhanced security with IP logging
- Session management with elevated privileges
- Redirect to super admin dashboard

### Admin Authentication  
- Admin login endpoint: `/api/admin/login`
- Role-based dashboard redirection
- Standard admin session management
- Redirect to admin panel

### Front-End User Authentication
- User login endpoint: `/api/auth/login` (existing)
- Standard user session management
- Redirect to user dashboard/home

## Security Boundaries

### Route Protection
1. **Super Admin Routes** (`/api/super-admin/*`): Require `superadmin` role
2. **Admin Routes** (`/api/admin/*`): Require `admin` or `superadmin` role  
3. **User Routes** (`/api/auth/*`, `/api/favorites/*`): Require valid user session
4. **Public Routes**: No authentication required

### Middleware Stack
1. **Authentication**: Verify valid session exists
2. **Authorization**: Check role permissions for requested resource
3. **Audit Logging**: Log all admin and super admin actions
4. **Rate Limiting**: Prevent abuse of admin endpoints

## User Flow Documentation

### Front-End User Journey
1. **Anonymous Shopper**: Browse profiles, view featured content
2. **Registration**: Create account with "user" role
3. **Authenticated User**: Add favorites, manage cart, checkout
4. **Purchase Flow**: Stripe integration for secure payments

### Admin User Journey  
1. **Admin Login**: Authenticate through admin portal
2. **Admin Dashboard**: Access content management tools
3. **Profile Management**: Approve/reject submissions
4. **User Management**: View and manage front-end users

### Super Admin Journey
1. **Super Admin Login**: Secure authentication with enhanced logging
2. **Super Admin Dashboard**: Full system oversight
3. **Admin Management**: Create/manage admin users
4. **System Configuration**: Modify site-wide settings

## Implementation Priority

### Phase 1: Schema and Authentication
- Update admin role validation
- Implement super admin authentication
- Create secure login endpoints

### Phase 2: Authorization Middleware
- Route protection implementation
- Role-based access controls
- Security middleware stack

### Phase 3: Dashboard and UI
- Super admin dashboard creation
- Admin user management interface
- Role-based navigation

### Phase 4: Testing and Audit
- Comprehensive access control testing
- Security audit trail implementation
- User flow validation

## Security Considerations

### Data Protection
- Sensitive admin data isolated from user data
- Role-based data access controls
- Audit trails for all administrative actions

### Session Security
- Secure session management per role type
- Automatic session expiration
- IP address logging for admin sessions

### Error Handling
- No role information leaked in error messages
- Graceful permission denial responses
- Security event logging

---

**Status**: ✅ **READY FOR REVIEW**
This design document establishes the foundation for secure role-based access control. 

**Next Steps**: Upon approval, proceed to Step 2 implementation of Super Admin Authentication and Management.