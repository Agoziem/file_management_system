"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveToken } from "@/utils/auth";
import Image from "next/image";
import {
  useResend2FACode,
  useVerify2FACode,
} from "@/data/auth";
import { verifyCodeSchema, verifyCodeSchemaType } from "@/schemas/auth";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/custom/spinner";
import OTPInputComponent from "../../ui/input-otp-spaced";

export function Verify2FAForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [resendCode, setResendCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { mutateAsync: verify2FA } = useVerify2FACode();
  const { mutateAsync: resend2FA } = useResend2FACode();
  const { storedValue: persistRedirect, setValue } = useLocalStorage<
    string | null
  >("persistRedirect", null);
  const { storedValue: persistEmail, removeValue } = useLocalStorage<
    string | null
  >("persistEmail", null);

  // form validation
  const form = useForm<verifyCodeSchemaType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const { reset, watch } = form;

  // Watch for changes in the code field to reset auto-submit state
  const codeValue = watch("code");
  useEffect(() => {
    if (codeValue.length < 6) {
      setAutoSubmitted(false);
    }
  }, [codeValue]);

  // -----------------------------------------------------
  // onSubmit function to handle form submission
  // -----------------------------------------------------
  const onSubmit = async (values: verifyCodeSchemaType) => {
    setVerifying(true);
    try {
      const response = await verify2FA(values.code);
      toast.success(response?.message || "Login successful!");
      reset();
      saveToken(response);
      if (!response?.user?.profile_completed) {
        router.push("/onboarding");
      } else if (persistRedirect) {
        setValue(null);
        removeValue();
        if (pathname === persistRedirect) {
          window.location.reload();
        } else {
          router.push(persistRedirect);
        }
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.detail?.message || "Failed to verify 2FA code";
      toast.error(message);
      // Reset auto-submit state on error so user can try again
      setAutoSubmitted(false);
    } finally {
      setVerifying(false);
    }
  };

  // -----------------------------------------------------
  // handleResendCode function to resend verification code
  // -----------------------------------------------------
  const handleResendCode = async () => {
    setResendCode(true);
    if (!persistEmail) {
      toast.error("Oops! Email not found!");
      setResendCode(false);
      return;
    }
    try {
      const response = await resend2FA({ email: persistEmail });
      toast.success(response?.message || "Code resent successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail?.message || "Failed to resend code!"
      );
    } finally {
      setResendCode(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
      
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary dark:text-white">2FA Verification</h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter the 2FA code sent to your email address.
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-3"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center">
                      Enter your 2FA verification code
                    </FormLabel>
                    <FormControl>
                      <OTPInputComponent 
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // Auto-submit when all digits are entered
                          if (value.length === 6 && !verifying && !autoSubmitted) {
                            setAutoSubmitted(true);
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        disabled={verifying}
                        className="mx-auto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full " 
                disabled={verifying}
              >
                {verifying ? (
                  <ButtonSpinner label="Verifying..." />
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center text-sm text-white/70">
                Didn&apos;t receive the code?{" "}
                {resendCode ? (
                  <ButtonSpinner label="Resending..." />
                ) : (
                  <span
                    role="button"
                    className="text-white hover:text-white/90 cursor-pointer hover:underline font-medium transition-colors duration-200"
                    onClick={handleResendCode}
                  >
                    Resend Code
                  </span>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
