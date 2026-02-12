import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
  userRole: UserRole;
}

export interface AuthContext {
  userId: string;
  userRole: UserRole;
  isAdmin: boolean;
  isManager: boolean;
  isClient: boolean;
}

type ApiHandler<T = any> = (
  request: NextRequest,
  context: { params?: T; auth: AuthContext }
) => Promise<Response> | Response;

/**
 * Get the authenticated user from the request
 */
async function getAuthenticatedUser(request: NextRequest): Promise<AuthContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const role = dbUser?.role ?? "CLIENT";

  return {
    userId: user.id,
    userRole: role,
    isAdmin: role === "ADMIN",
    isManager: role === "MANAGER",
    isClient: role === "CLIENT",
  };
}

/**
 * Middleware that requires authentication
 * Returns 401 if not authenticated
 */
export function withAuth<T = any>(handler: ApiHandler<T>) {
  return async (request: NextRequest, routeContext?: { params?: T }) => {
    const auth = await getAuthenticatedUser(request);

    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    return handler(request, { params: routeContext?.params, auth });
  };
}

/**
 * Middleware that requires admin or manager role
 * Returns 401 if not authenticated, 403 if not admin/manager
 */
export function withAdmin<T = any>(handler: ApiHandler<T>) {
  return withAuth<T>(async (request, context) => {
    if (!context.auth.isAdmin && !context.auth.isManager) {
      return NextResponse.json(
        { success: false, error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    return handler(request, context);
  });
}

/**
 * Middleware that verifies the requesting user owns the resource
 * Admins/managers bypass ownership check
 *
 * @param getResourceOwnerId - Function that extracts owner ID from the request/database
 */
export function withOwnership<T = any>(
  getResourceOwnerId: (
    request: NextRequest,
    context: { params?: T; auth: AuthContext }
  ) => Promise<string | null> | string | null,
  options?: {
    allowAdmin?: boolean; // Whether admins can bypass (default: true)
  }
) {
  const { allowAdmin = true } = options || {};

  return withAuth<T>(async (request, context) => {
    // Admins/managers can access any resource (unless explicitly disabled)
    if (allowAdmin && (context.auth.isAdmin || context.auth.isManager)) {
      return await Promise.resolve().then(() =>
        (null as any) // Signal to continue without ownership check
      );
    }

    // Get the owner ID of the resource
    const ownerId = await getResourceOwnerId(request, context);

    if (!ownerId) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Check if requesting user owns the resource
    if (ownerId !== context.auth.userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden. You don't have access to this resource." },
        { status: 403 }
      );
    }

    return null; // Continue to handler
  });
}

/**
 * Helper to check ownership for a handler
 * Returns a wrapped handler that checks ownership and passes through if authorized
 */
export function checkOwnership<T = any>(
  getResourceOwnerId: (
    request: NextRequest,
    context: { params?: T; auth: AuthContext }
  ) => Promise<string | null> | string | null,
  handler: ApiHandler<T>,
  options?: {
    allowAdmin?: boolean;
  }
): ApiHandler<T> {
  return async (request, context) => {
    const { allowAdmin = true } = options || {};

    // Admins/managers can access any resource (unless explicitly disabled)
    if (allowAdmin && (context.auth.isAdmin || context.auth.isManager)) {
      return handler(request, context);
    }

    // Get the owner ID of the resource
    const ownerId = await getResourceOwnerId(request, context);

    if (!ownerId) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Check if requesting user owns the resource
    if (ownerId !== context.auth.userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden. You don't have access to this resource." },
        { status: 403 }
      );
    }

    return handler(request, context);
  };
}

/**
 * Apply user-based filtering to Prisma where clause
 * Admins/managers see everything, clients see only their own data
 */
export function applyUserFilter<T extends Record<string, any>>(
  where: T,
  auth: AuthContext,
  clientIdField: string = "clientId"
): T {
  if (auth.isAdmin || auth.isManager) {
    return where;
  }

  return {
    ...where,
    [clientIdField]: auth.userId,
  } as T;
}
