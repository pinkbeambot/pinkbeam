import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ResourcesAdminClient } from "./ResourcesAdminClient";

export const metadata: Metadata = {
  title: "Resources Admin — Pink Beam",
  description: "Manage resource library content",
};

async function getResources() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { downloads: true },
        },
      },
    });
    return resources;
  } catch {
    return [];
  }
}

export default async function ResourcesAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/web');
  }

  const resources = await getResources();

  return <ResourcesAdminClient resources={resources} />;
}
