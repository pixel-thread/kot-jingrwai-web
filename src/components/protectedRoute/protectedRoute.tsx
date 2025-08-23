"use client";
import { useAuth } from "@/hooks/auth/useAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { LoadingDots } from "../common/Loading";

type RoleRoute = {
  url: string;
  role: string[];
  redirect?: string;
  needAuth?: boolean;
};

const routeRoles: RoleRoute[] = [
  {
    url: "/dashboard/*",
    role: ["SUPER_ADMIN", "USER", "PARTNER"],
    needAuth: true,
  },
];

type PropsT = {
  children: React.ReactNode;
};

const pageAccessOnlyIfUnAuthenticated: string[] = ["/auth"];

export const RoleBaseRoute = ({ children }: PropsT) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthLoading } = useAuth();
  const [cookies] = useCookies(["AUTH_TOKEN"]); // Get the AUTH_TOKEN cookie
  const userRoles: string = useMemo(() => user?.role || "USER", [user]); // Get the user's roles
  const isAuthenticated = !!(user && cookies.AUTH_TOKEN); //

  // Show loader during route changes or delays
  useEffect(() => {
    if (isAuthLoading) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); // delay in ms
    return () => clearTimeout(timer); // Cleanup the timer
  }, [isAuthLoading, pathName]);

  // Handle authentication and role-based redirects
  useEffect(() => {
    // Wait until authentication loading is complete to proceed
    if (isAuthLoading) return;

    // Step 1: Identify the current route from the `routeRoles` configuration
    const currentRoute = routeRoles.find((route) => {
      if (route.url === pathName) return true; // Direct match for the route
      if (route.url.endsWith("/*")) {
        const basePath = route.url.replace("/*", ""); // Handle wildcard route (e.g., `/dashboard/*`)
        return pathName.startsWith(basePath); // Check if the current path starts with the base path
      }
      return false; // No match found
    });

    // Step 2: Handle authentication-based redirection
    if (currentRoute) {
      // If the route requires authentication and the user is not authenticated
      if (currentRoute.needAuth && !isAuthenticated) {
        // Redirect the user to the signin page and include the current path as a `redirect` query parameter
        router.replace(`/auth?redirect=${encodeURIComponent(pathName)}`);
        return; // Exit the logic as redirection is in progress
      }

      // Step 3: Handle role-based access control
      if (isAuthenticated) {
        // Check if the user has at least one of the required roles for the current route
        const hasRequiredRole = currentRoute.role.some(
          (role) => userRoles === role,
        );

        // If the user does not have the required role(s)
        if (!hasRequiredRole) {
          // Redirect the user to a fallback page specified in the route's configuration or to the homepage
          router.replace(currentRoute.redirect || "/forbidden");
          return; // Exit the logic as redirection is in progress
        }
      }
    }
  }, [pathName, isAuthenticated, userRoles, router, isAuthLoading]);

  // Prevent authenticated users from accessing unauthenticated-only pages
  useEffect(() => {
    if (isAuthLoading || isLoading) return;
    if (isAuthenticated && pageAccessOnlyIfUnAuthenticated.includes(pathName)) {
      router.push(redirectTo || "/dashboard");
    }
  }, [isAuthenticated, pathName, redirectTo, router, isAuthLoading, isLoading]);

  // Display preloader if authentication or loading is in progress
  if (isAuthLoading || isLoading) {
    return <LoadingDots />;
  }

  return <>{children}</>;
};
