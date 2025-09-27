import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosInstanceWithToken } from "@/data/instance";
import { toast } from "sonner";
import {
  RegisterSchema,
  LoginSchema,
  TokenRequestSchema,
  PasswordResetConfirmSchema,
  PasswordResetSchema,
  TwoFactorConfirmationCreateSchema,
  verifyTokenSchemaType,
  verifyTokenSchema,
  SingleEmailSchemaType,
  SingleEmailSchema,
} from "@/schemas/auth";
import { z } from "zod";
import { BaseResponse, CreateUserResponse, LoginResponse, LoginSuccessResponse, LogoutResponse, OAuthTokenResponse, PasswordResetResponse, TokenResponse, VerificationResponse } from "@/types/auth";
import { removeToken } from "@/utils/auth";



// -----------------------------------------------
// Authentication - Core Auth
// -------------------------------------------------

// Create user account (signup)
export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof RegisterSchema>): Promise<CreateUserResponse> => {
      const validatedData = RegisterSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/signup",
        validatedData
      );
      return response.data;
    }
  });
};

// Resend verification email
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (data: SingleEmailSchemaType): Promise<BaseResponse> => {
      const validatedData = SingleEmailSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/resend-verification",
        validatedData
      );
      return response.data;
    }
  });
};

// Login user
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
      const validatedData = LoginSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/login",
        validatedData
      );
      return response.data;
    }
  });
};

// Verify user account this should be a post event
export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: async (data: verifyTokenSchemaType): Promise<LoginSuccessResponse> => {
      const validatedData = verifyTokenSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/verify-account",
        validatedData
      );
      return response.data;
    }
  });
};

// Get new access token (refresh)
export const useRefreshToken = () => {
  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async (): Promise<TokenResponse> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/auth/refresh_token");
      return response.data;
    },
    enabled: false, // Only call manually
    onError: (error: any) => {
      const message = error.response?.data?.detail?.message || "Failed to refresh token";
      toast.error(message);
    },
  });
};

// Logout user
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Clear all cached data on logout
      removeToken();
      queryClient.clear();
    }
  });
};

// Password reset request
export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof TokenRequestSchema>): Promise<BaseResponse> => {
      const validatedData = TokenRequestSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/password-reset-request",
        validatedData
      );
      return response.data;
    }
  });
};

// Password reset confirm
export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: async ({ token, data }: { 
      token: string; 
      data: z.infer<typeof PasswordResetConfirmSchema> 
    }): Promise<PasswordResetResponse> => {
      const validatedData = PasswordResetConfirmSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        `/api/v1/auth/password-reset-confirm/${token}`,
        validatedData
      );
      return response.data;
    }
  });
};

// Password reset (authenticated)
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof PasswordResetSchema>): Promise<PasswordResetResponse> => {
      const validatedData = PasswordResetSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/password-reset",
        validatedData
      );
      return response.data;
    }
  });
};

// -----------------------------------------------
// Authentication - 2FA
// -------------------------------------------------

// Enable 2FA
export const useEnable2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<BaseResponse> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/auth/enable-2FA");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      toast.success("2FA enabled successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail?.message || "Failed to enable 2FA";
      toast.error(message);
    },
  });
};

// Verify 2FA code
export const useVerify2FACode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string): Promise<LoginSuccessResponse> => {
      const response = await AxiosInstanceWithToken.get(
        `/api/v1/auth/verify-2FA-code/${token}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
    }
  });
};

// Resend 2FA code
export const useResend2FACode = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof TwoFactorConfirmationCreateSchema>): Promise<BaseResponse> => {
      const validatedData = TwoFactorConfirmationCreateSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/resend-2FA-code",
        validatedData
      );
      return response.data;
    }
  });
};

// Disable 2FA
export const useDisable2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<BaseResponse> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/auth/disable-2FA");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      toast.success("2FA disabled successfully");
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// -----------------------------------------------
// Authentication - OAuth
// -------------------------------------------------

// Login via Google
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<BaseResponse> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/auth/login/google");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Create OAuth token
export const useCreateOAuthToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string): Promise<OAuthTokenResponse> => {
      const response = await AxiosInstanceWithToken.get(
        `/api/v1/auth/oauth_token/${code}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// -----------------------------------------------
// Combined Authentication Hooks
// -------------------------------------------------

// Complete authentication flow hook
export const useAuthFlow = () => {
  const signup = useSignup();
  const login = useLogin();
  const logout = useLogout();
  const resendVerification = useResendVerification();
  const passwordResetRequest = usePasswordResetRequest();

  return {
    signup: signup.mutateAsync,
    login: login.mutateAsync,
    logout: logout.mutateAsync,
    resendVerification: resendVerification.mutateAsync,
    requestPasswordReset: passwordResetRequest.mutateAsync,
    isSigningUp: signup.isLoading,
    isLoggingIn: login.isLoading,
    isLoggingOut: logout.isLoading,
    error: signup.error || login.error || logout.error,
  };
};

// 2FA management hook
export const use2FAManagement = () => {
  const enable2FA = useEnable2FA();
  const disable2FA = useDisable2FA();
  const verify2FA = useVerify2FACode();
  const resend2FA = useResend2FACode();

  return {
    enable: enable2FA.mutateAsync,
    disable: disable2FA.mutateAsync,
    verify: verify2FA.mutateAsync,
    resend: resend2FA.mutateAsync,
    isEnabling: enable2FA.isLoading,
    isDisabling: disable2FA.isLoading,
    isVerifying: verify2FA.isLoading,
    isResending: resend2FA.isLoading,
    error: enable2FA.error || disable2FA.error || verify2FA.error || resend2FA.error,
  };
};

// Password management hook
export const usePasswordManagement = () => {
  const resetRequest = usePasswordResetRequest();
  const resetConfirm = usePasswordResetConfirm();
  const passwordReset = usePasswordReset();

  return {
    requestReset: resetRequest.mutateAsync,
    confirmReset: resetConfirm.mutateAsync,
    changePassword: passwordReset.mutateAsync,
    isRequestingReset: resetRequest.isLoading,
    isConfirmingReset: resetConfirm.isLoading,
    isChangingPassword: passwordReset.isLoading,
    error: resetRequest.error || resetConfirm.error || passwordReset.error,
  };
};

// OAuth authentication hook
export const useOAuthAuth = () => {
  const googleLogin = useGoogleLogin();
  const createOAuthToken = useCreateOAuthToken();

  return {
    loginWithGoogle: googleLogin.mutateAsync,
    createToken: createOAuthToken.mutateAsync,
    isGoogleLoading: googleLogin.isLoading,
    isTokenLoading: createOAuthToken.isLoading,
    error: googleLogin.error || createOAuthToken.error,
  };
};