"use client";

import React, { createContext, useContext } from "react";
import { UserRole } from "@prisma/client";

interface UserRoleContextValue {
  role: UserRole | null;
  isAdmin: boolean;
  isManager: boolean;
  isClient: boolean;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextValue | undefined>(undefined);

interface UserRoleProviderProps {
  children: React.ReactNode;
  role: UserRole | null;
}

export function UserRoleProvider({ children, role }: UserRoleProviderProps) {
  const value: UserRoleContextValue = {
    role,
    isAdmin: role === "ADMIN",
    isManager: role === "MANAGER",
    isClient: role === "CLIENT" || role === null,
    isLoading: false,
  };

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
}

/**
 * Hook to access the current user's role
 * Must be used within a UserRoleProvider
 */
export function useUserRole(): UserRoleContextValue {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
}
