
// class Role(str, Enum):
//     SUPER_ADMIN = "super_admin"
//     ADMIN = "admin"
//     BUSINESS_USER = "business_user"
//     STANDARD_USER = "standard_user"

// ---------- User ----------
export type UserResponseModel = {
  id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  gender?: string | null;
  role:  "super_admin" | "admin" | "business_user" | "standard_user";
  profile_completed: boolean;
  is_verified: boolean;
  fcmtoken?: string | null;
};

export type UserModel = {
  id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  state?: string | null;
  country?: string | null;
  avatar?: string | null;
  bio?: string | null;
  gender?: string | null;
  role: "super_admin" | "admin" | "business_user" | "standard_user";
  is_verified: boolean;
  two_factor_enabled?: boolean;
  profile_completed: boolean;
  is_oauth: boolean;
  fcmtoken?: string | null;
  created_at: string; // ISO datetime
};

export type MiniUserModel = {
  user_id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  avatar?: string | null;
  fcmtoken?: string | null;
  role: "super_admin" | "admin" | "business_user" | "standard_user";
};

// ---------- Activity ----------
export type ActivityBase = {
  description: string;
  activity_type: "create" | "update" | "delete";
  user_id: string;
};

export type ActivityResponse = ActivityBase & {
  id: string;
  created_at: string;
};