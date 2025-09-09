"use client";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/auth";
import { useSignup } from "@/data/auth";
import { API_URL } from "@/data/constants";
import { ButtonSpinner } from "@/components/custom/spinner";
import Link from "next/link";
import PasswordInputtwo from "../custom/password-input-2";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { mutateAsync: register } = useSignup();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  // -----------------------------------------------------
  // onSubmit function to handle form submission
  // -----------------------------------------------------
  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const response = await register(data);
      toast.success(response?.message);
      reset();
      router.push("/verify-email");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail?.message || "Registration failed."
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary">Create Account</h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your details to create an account.
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-3"
            >
              {/* Google Button */}
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`${API_URL}/auth/login/google`, "_self");
                  }}
                >
                  <FcGoogle />
                  Sign up with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Name Fields */}
              <div className="grid  grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firstname</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lastname</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInputtwo {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <ButtonSpinner label="Creating account..." />
                ) : (
                  "Sign up"
                )}
              </Button>

              {/* Link */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
