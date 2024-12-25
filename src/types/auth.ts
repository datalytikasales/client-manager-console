export type UserRole = "client" | "manager" | "admin";
export type UserTable = "app_client_users" | "app_manager_users" | "app_admin_users";

export interface ClientUser {
  id: number;
  email: string;
  password: string;
  company_id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  clients?: Array<{ id: number }>;
}

export interface ManagerUser {
  id: number;
  email: string;
  password: string;
  company_id: number;
  manager_id: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export type UserData = ClientUser | ManagerUser | AdminUser;