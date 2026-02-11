/**
 * Analytics Stats API
 * Retrieve analytics statistics for the dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role (assuming ADMIN role can access analytics)
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get page view stats
    const pageViews = await prisma.analyticsEvent.count({
      where: {
        type: "pageview",
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get unique paths (approximation of unique pages)
    const uniquePaths = await prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: {
        type: "pageview",
        createdAt: {
          gte: startDate,
        },
        path: {
          not: null,
        },
      },
      _count: {
        path: true,
      },
      orderBy: {
        _count: {
          path: "desc",
        },
      },
      take: 10,
    });

    // Get event stats
    const events = await prisma.analyticsEvent.count({
      where: {
        type: "event",
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get top events
    const topEvents = await prisma.analyticsEvent.groupBy({
      by: ["name"],
      where: {
        type: "event",
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: "desc",
        },
      },
      take: 10,
    });

    // Get daily breakdown
    const dailyStats = await prisma.$queryRaw<
      { date: string; pageviews: bigint; events: bigint }[]
    >`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN type = 'pageview' THEN 1 END) as pageviews,
        COUNT(CASE WHEN type = 'event' THEN 1 END) as events
      FROM analytics_events
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    // Get recent events
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      select: {
        id: true,
        type: true,
        name: true,
        path: true,
        createdAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({
      summary: {
        pageViews,
        events,
        total: pageViews + events,
        days,
      },
      topPages: uniquePaths.map((p) => ({
        path: p.path,
        count: p._count.path,
      })),
      topEvents: topEvents.map((e) => ({
        name: e.name,
        count: e._count.name,
      })),
      dailyStats: dailyStats.map((d) => ({
        date: d.date,
        pageviews: Number(d.pageviews),
        events: Number(d.events),
      })),
      recentEvents,
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}