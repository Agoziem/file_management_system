"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveToken } from "@/utils/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CgSpinner } from "react-icons/cg";
import { useCreateOAuthToken } from "@/data/auth";

const OauthSuccess = () => {
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");
  const { storedValue: persistRedirect, setValue } = useLocalStorage<
    string | null
  >("persistRedirect", null);
  const pathname = usePathname();
  const { mutateAsync: createOauthUser } = useCreateOAuthToken();
  const { setValue: setPersistEmail } = useLocalStorage<string | null>(
    "persistEmail",
    null
  );

  const router = useRouter();

  useEffect(() => {
    if (!code) {
      return;
    }

    const createOauthUserToken = async () => {
      try {
        const response = await createOauthUser(code);
        toast.success(response?.message || "Login successful!");
      
        // Check if user has 2FA enabled
        if ("two_factor_required" in response) {
          const email = response?.user?.email;
          setPersistEmail(email);
          router.push("/verify-2FA");
        } else {
          // User is without 2FA
          saveToken(response);
          if (!response?.user?.profile_completed) {
            router.push("/profile");
          } else if (persistRedirect) {
            setValue(null);
            if (pathname === persistRedirect) {
              window.location.reload();
            } else {
              router.push(persistRedirect);
            }
          } else {
            router.push("/");
          }
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.detail?.message ||
            "Login failed. Please try again."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    createOauthUserToken();
  }, [code, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-md w-full max-w-96 mx-auto space-y-4">
        <div className="flex flex-col items-center justify-center">
          <CgSpinner className="animate-spin" size={40} />
          <h4 className="text-xl font-bold mt-2">Completing Setup</h4>
        </div>
        <p className=" text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default OauthSuccess;
