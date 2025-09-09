
// ---------- Verification Token ----------
export type VerificationTokenBase = {
  email: string;
  token: string;
  expires: string; // ISO datetime
};

export type VerificationTokenResponse = VerificationTokenBase & {
  id: string; // UUID
};

// ---------- Password Reset Token ----------
export type PasswordResetTokenBase = {
  email: string;
  token: string;
  expires: string;
};

export type PasswordResetTokenResponse = PasswordResetTokenBase & {
  id: string;
};

// ---------- Two-Factor Token ----------
export type TwoFactorTokenBase = {
  email: string;
  token: string;
  expires: string;
};

export type TwoFactorTokenResponse = TwoFactorTokenBase & {
  id: string;
};

// ---------- Two-Factor Confirmation ----------
export type TwoFactorConfirmationBase = {
  user_id: string;
};

export type TwoFactorConfirmationResponse = TwoFactorConfirmationBase & {
  id: string;
};

// ---------- Main Auth Notification ----------
export type MainAuthNotificationModel = {
  email: string;
  token: string;
  last_name: string;
  first_name?: string | null;
};

// ---------------------------------------------------
// Response Types
// ---------------------------------------------------

export interface UserInfo {
  id: string;                // serialized UUID as string
  email: string;             // validated email string
  profile_completed: boolean;
}

export interface BaseResponse {
  message: string;
}

export interface VerificationResponse extends BaseResponse {
  verification_needed: boolean;
}

export interface TwoFactorResponse extends BaseResponse {
  two_factor_required: boolean;
  user: {
    email: string;
    uid: string;             // matches backend return shape
  };
}

export interface LoginSuccessResponse extends BaseResponse {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
}

export interface TokenResponse {
  access_token: string;
}

// Assuming UserModel has these basic fields (adjust if more exist)
export interface UserModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  profile_completed: boolean;
}

export interface CreateUserResponse extends BaseResponse {
  user: UserModel;
}

export type LogoutResponse = BaseResponse;

export type PasswordResetResponse = BaseResponse;

// Union type for login responses
export type LoginResponse =
  | VerificationResponse
  | TwoFactorResponse
  | LoginSuccessResponse;


export type OAuthTokenResponse =
  | TwoFactorResponse
  | LoginSuccessResponse;