"use client";
import { AuthProvider } from "./auth";
import { TQueryProvider } from "./query";
import { RoleBaseRoute } from "../protectedRoute/protectedRoute";
import { Toaster } from "../ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@/env";
import { ThemeProvider } from "next-themes";
import { CookiesProvider } from "react-cookie";

type MainProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};
export const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <CookiesProvider>
      <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <TQueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <RoleBaseRoute>
                {children}
                <Toaster />
              </RoleBaseRoute>
            </AuthProvider>
          </ThemeProvider>
        </TQueryProvider>
      </ClerkProvider>
    </CookiesProvider>
  );
};
