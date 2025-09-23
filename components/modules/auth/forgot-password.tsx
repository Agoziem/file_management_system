"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/custom/spinner";
import Image from "next/image";
import { TokenRequestSchema, TokenRequestSchemaType } from "@/schemas/auth";
import { usePasswordResetRequest } from "@/data/auth";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { mutateAsync: forgotPassword } = usePasswordResetRequest();
  const form = useForm<TokenRequestSchemaType>({
    resolver: zodResolver(TokenRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: TokenRequestSchemaType) => {
    try {
      const response = await forgotPassword(values);
      toast.success(response?.message || "Reset link sent successfully!");
      reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail?.message || "Failed to send reset link."
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary dark:text-white">
              Reset Password
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your email address to receive a password reset link.
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-3"
            >
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <ButtonSpinner label="sending..." />
                ) : (
                  "Send Reset Link"
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
