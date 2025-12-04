import { createAccessControl } from "better-auth/plugins/access";

// Define access control statement with resources and actions
// This is shared between server and client
export const statement = {
  // Service management
  service: ['create', 'read', 'update', 'delete', 'list'],
  // Order management
  order: ['create', 'read', 'update', 'delete', 'list', 'assign', 'deliver'],
  // User management
  user: ['create', 'read', 'update', 'delete', 'list', 'ban', 'unban'],
  // File management
  file: ['upload', 'download', 'delete'],
  // Platform settings
  settings: ['read', 'update'],
  // Analytics/Dashboard
  analytics: ['read'],
} as const;

// Create access control instance (safe for client use)
export const ac = createAccessControl(statement);

// Define roles with their permissions (safe for client use)
export const roles = {
  // Regular users (buyers) - can only purchase and manage their orders
  user: ac.newRole({
    service: ['read', 'list'],
    order: ['create', 'read', 'list'], // Can create and view their orders
    file: ['upload', 'download'], // Can upload requirements and download deliverables
  }),

  // Agents (sellers) - can manage assigned orders and deliver work
  agent: ac.newRole({
    service: ['read', 'list'],
    order: ['read', 'list', 'update', 'deliver'], // Can manage and deliver orders
    file: ['upload', 'download', 'delete'], // Can manage files for their orders
    analytics: ['read'], // Can view their own analytics
  }),

  // Super Admin - full platform control
  super_admin: ac.newRole({
    service: ['create', 'read', 'update', 'delete', 'list'],
    order: ['create', 'read', 'update', 'delete', 'list', 'assign', 'deliver'],
    user: ['create', 'read', 'update', 'delete', 'list', 'ban', 'unban'],
    file: ['upload', 'download', 'delete'],
    settings: ['read', 'update'],
    analytics: ['read'],
  }),
};
