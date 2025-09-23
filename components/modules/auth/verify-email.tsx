"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveToken } from "@/utils/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  verifyCodeSchema,
  verifyCodeSchemaType,
  verifyTokenSchema,
  verifyTokenSchemaType,
} from "@/schemas/auth";
import { useResendVerification, useVerifyAccount } from "@/data/auth";
import { ButtonSpinner } from "@/components/custom/spinner";
import OTPInputComponent from "../../ui/input-otp-spaced";

export function EmailVerification({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [resendToken, setResendToken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const { mutateAsync: verifyEmailToken } = useVerifyAccount();
  const { mutateAsync: resendVerificationEmail } = useResendVerification();
  const { storedValue: persistRedirect, setValue } = useLocalStorage<
    string | null
  >("persistRedirect", null); // persistRedirect is the path to redirect after verification
  const { storedValue: persistEmail, removeValue } = useLocalStorage<
    string | null
  >("persistEmail", null); // persistEmail is the email address used to resend the code
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<verifyTokenSchemaType>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  const { reset } = form;

  // -----------------------------------------------------
  // onSubmit function to handle form submission
  // -----------------------------------------------------
  const onSubmit = async (values: verifyTokenSchemaType) => {
    setVerifying(true);
    try {
      console.log(`Verifying email token...: ${values.token}`);
      const response = await verifyEmailToken(values);
      toast.success(response?.message || "Email verified successfully!");
      saveToken(response);
      reset();
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
      toast.error(
        error.response?.data?.detail?.message || "Invalid verification code!"
      );
    } finally {
      setVerifying(false);
    }
  };

  // -----------------------------------------------------
  // handleResendCode function to resend verification code
  // -----------------------------------------------------
  const handleResendToken = async () => {
    setResendToken(true);
    if (!persistEmail) {
      toast.error("Oops! Email not found!");
      setResendToken(false);
      return;
    }
    try {
      const response = await resendVerificationEmail({ email: persistEmail });
      toast.success(response?.message || "Token resent successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail?.message || "Failed to resend code!"
      );
    } finally {
      setResendToken(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary dark:text-white">Email Verification</h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter the verification code sent to your email address.
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-3"
            >
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center block">
                      Verification Token
                    </FormLabel>
                    <FormControl>
                      <OTPInputComponent
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // Auto-submit when all digits are entered
                          if (
                            value.length === 6 &&
                            !verifying &&
                            !autoSubmitted
                          ) {
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

              <Button type="submit" className="w-full" disabled={verifying}>
                {verifying ? (
                  <ButtonSpinner label="verifying..." />
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center text-sm">
                you didn&apos;t receive the code?{" "}
                {resendToken ? (
                  <ButtonSpinner label="resending..." />
                ) : (
                  <span
                    role="button"
                    className="text-primary cursor-pointer hover:underline"
                    onClick={handleResendToken}
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
