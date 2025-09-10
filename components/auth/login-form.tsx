"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/utils/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import { LoginSchema, LoginSchemaType } from "@/schemas/auth";
import { useLogin } from "@/data/auth";
import { API_URL } from "@/data/constants";
import { ButtonSpinner } from "@/components/custom/spinner";
import { PasswordInput } from "../custom/password-input";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const pathname = usePathname();
  const { storedValue, setValue } = useLocalStorage<string | null>(
    "persistRedirect",
    null
  );
  const { setValue: setPersistEmail } = useLocalStorage<string | null>(
    "persistEmail",
    null
  );
  const router = useRouter();
  const { mutateAsync: Login } = useLogin();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  // persist the Redirect URL in local storage
  useEffect(() => {
    if (redirect) {
      setValue(redirect);
    }
  }, [redirect]);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await Login(data);
      console.log(response);
      if ("two_factor_required" in response) {
        toast.success(response.message);
        reset();
        setPersistEmail(data.email);
        router.push("/verify-2FA");
      } else if ("verification_needed" in response) {
        toast.success(response.message);
        reset();
        setPersistEmail(data.email);
        router.push("/verify-email");
      } else {
        toast.success(response.message);
        reset();
        saveToken(response);
        if (!response?.user.profile_completed) {
          router.push("/onboarding");
        } else if (redirect) {
          const redirectUrl = storedValue || redirect;
          setValue(null);
          if (pathname === redirectUrl) {
            window.location.reload();
          } else {
            router.push(redirectUrl);
          }
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail?.message || "Login failed.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary">
              Login to your account
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your email address and password to login.
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-3"
            >
              <Button
                variant="outline"
                className="w-full flex gap-2 mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`${API_URL}/auth/login/google`, "_self");
                }}
              >
                <FcGoogle />
                Login with Google
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="Placeholder" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <ButtonSpinner label="signing in..." />
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
