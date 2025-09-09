import type { Metadata } from "next";
import "./globals.css";
import { Jost } from "next/font/google";
import Providers from "@/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layouts/sidebar";
import Navbar from "@/components/layouts/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Load Jost font
const jost = Jost({
  subsets: ["latin"],
  variable: "--jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "File Management System",
  description:
    "A web application for managing files of all types. With full storage capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${jost.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
