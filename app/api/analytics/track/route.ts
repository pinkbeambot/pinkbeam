/**
 * Analytics Track API
 * Receives analytics events from the client and stores them
 * Privacy-first: hashes IP, no cookies, no PII
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIpForPrivacy } from "@/lib/analytics/plausible";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, path, url, referrer, metadata } = body;

    // Validate required fields
    if (!type || !name) {
      return NextResponse.json(
        { error: "Missing required fields: type, name" },
        { status: 400 }
      );
    }

    // Get client IP and hash it for privacy
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]?.trim()
      : request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "unknown";
    const ipHash = ip !== "unknown" ? hashIpForPrivacy(ip) : null;

    // Get user agent
    const userAgent = request.headers.get("user-agent");

    // Get authenticated user ID if available
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // Not authenticated - that's fine
    }

    // Store the analytics event
    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        name,
        path: path || undefined,
        referrer: referrer || undefined,
        userAgent: userAgent || undefined,
        ipHash,
        userId,
        metadata: metadata || undefined,
      },
    });

    return NextResponse.json({ success: true, id: event.id });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    // Don't fail the request - analytics should never break the app
    return NextResponse.json({ success: false }, { status: 200 });
  }
}