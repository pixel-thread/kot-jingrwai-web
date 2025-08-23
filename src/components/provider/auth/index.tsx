"use client";
import { AuthContext } from "@/lib/context/auth";
import { AUTH_ENDPOINT } from "@/lib/constants/endpoints/auth";
import { AuthContextT } from "@/types/auth/context";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { AUTH_TOKEN_KEY } from "@/lib/constants/token";
import { useCookies } from "react-cookie";

type AuthProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};

type UserT = Required<{ id: string; role: string }>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isSignedIn, getToken } = useAuth();
  const [user, setUser] = React.useState<UserT | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies([AUTH_TOKEN_KEY]);

  const { isPending: isLoadingMe, mutate: refetch } = useMutation({
    mutationKey: ["me"],
    mutationFn: () => http.get<UserT>(AUTH_ENDPOINT.GET_ME),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data.data;
      }
      removeCookie(AUTH_TOKEN_KEY, { path: "/" });
      setUser(null);
      return null;
    },
    onError: () => {
      removeCookie(AUTH_TOKEN_KEY, { path: "/" });
      setUser(null);
    },
  });

  // Get token from Clerk and set cookie
  const getClerkToken = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        setCookie(AUTH_TOKEN_KEY, token, {
          path: "/",
          secure: process.env.NODE_ENV === "production", // secure in prod
          sameSite: "lax",
        });
      }
    } catch (err) {
      // Add logging here if needed
      console.error("Failed to get Clerk token", err);
      removeCookie(AUTH_TOKEN_KEY, { path: "/" });
    }
  }, [getToken, setCookie, removeCookie]);

  // Set token on sign-in
  useEffect(() => {
    if (isSignedIn && !cookies.AuthToken) {
      getClerkToken();
    }
  }, [isSignedIn, cookies, getClerkToken]);

  // Refetch user if token is present and signed in
  useEffect(() => {
    if (cookies.AuthToken && isSignedIn) {
      refetch();
    }
  }, [cookies, isSignedIn, refetch]);

  const value: AuthContextT = {
    user,
    isAuthLoading: isLoadingMe,
    isSuperAdmin: user?.role === "SUPER_ADMIN" || false,
    refresh: () => refetch(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
