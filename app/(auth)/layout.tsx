import { AuthCarousel } from "@/components/modules/auth/auth-carousel";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const authImages = [
    "/images/auth_1.jpg",
    "/images/auth_2.jpg",
    "/images/auth_3.jpg",
  ];
  return (
    <div className="min-h-svh flex justify-center items-center overflow-hidden">
      <Card className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-[90%] md:w-[65%] max-h-fit space-y-4 p-4">
        {/* Left Section - Carousel */}
        <div className="hidden lg:flex relative">
          <AuthCarousel
            images={authImages}
            interval={6000}
            className="w-full h-full rounded-2xl overflow-hidden"
          />
        </div>

        {/* Right Section - Auth Forms */}
        <ScrollArea className="max-h-[calc(100vh-60px)]">{children}</ScrollArea>
      </Card>
    </div>
  );
};

export default AuthLayout;
