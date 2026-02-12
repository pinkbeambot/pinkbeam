import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * Get the current user's role from the database
 * Called server-side to fetch user role based on Supabase auth
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user from database to get role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  return dbUser?.role ?? null;
}

/**
 * Get the current user's ID and role from the database
 * Creates the user record if it doesn't exist
 */
export async function getUserInfo(): Promise<{ userId: string; role: UserRole } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user from database to get role
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  // If user doesn't exist in database, create them
  if (!dbUser) {
    console.log(`Creating database user for ${user.email}`);
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'CLIENT', // Default role
      },
      select: { role: true },
    });
  }

  return {
    userId: user.id,
    role: dbUser.role,
  };
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "ADMIN";
}

/**
 * Check if the current user is a client
 */
export async function isClient(): Promise<boolean> {
  const role = await getUserRole();
  return role === "CLIENT" || role === null; // Default to CLIENT
}
