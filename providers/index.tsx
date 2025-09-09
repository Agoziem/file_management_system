"use client";
import React from "react";
import QueryProvider from "./react-query";
import { ThemeProvider } from "./theme";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
};

export default Providers;
