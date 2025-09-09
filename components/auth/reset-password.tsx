"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { PasswordResetConfirmSchema, PasswordResetConfirmSchemaType } from "@/schemas/auth";
import { usePasswordResetConfirm } from "@/data/auth";
import { ButtonSpinner } from "@/components/custom/spinner";
import { PasswordInput } from "@/components/custom/password-input";


export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutateAsync: resetPassword } = usePasswordResetConfirm();
  const router = useRouter();
  const form = useForm<PasswordResetConfirmSchemaType>({
    resolver: zodResolver(PasswordResetConfirmSchema),
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
    },
  });

  const { reset, formState: {isSubmitting} } = form;

  const onSubmit = async (values: PasswordResetConfirmSchemaType) => {
    console.log("Reset Password:", values);
    if (!token) {
      toast.error("Token does not exist");
      return;
    }
    try {
      const response = await resetPassword({
        token,
        data: values,
      });
      toast.success(response?.message || "Password reset successfully!");
      reset();
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.detail?.message || "Failed to reset password.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary">Reset Password</h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your new password to reset your account.
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-3">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Re-enter your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <ButtonSpinner label="resetting..." />
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center text-sm">
                Back to{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
