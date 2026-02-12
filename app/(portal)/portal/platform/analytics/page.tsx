"use client";

/**
 * Platform Analytics Portal
 * View page views, events, traffic sources, and other analytics data
 */

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Globe,
  Activity,
} from "lucide-react";

interface AnalyticsData {
  summary: {
    pageViews: number;
    events: number;
    total: number;
    days: number;
  };
  topPages: { path: string | null; count: number }[];
  topEvents: { name: string; count: number }[];
  dailyStats: { date: string; pageviews: number; events: number }[];
  recentEvents: {
    id: string;
    type: string;
    name: string;
    path: string | null;
    createdAt: string;
    metadata: unknown;
  }[];
}

const COLORS = ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"];

export default function AnalyticsPortalPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics/stats?days=${days}`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [days]);

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error loading analytics: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Privacy-friendly analytics portal
            </p>
          </div>
          <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v, 10))}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.summary.pageViews.toLocaleString() || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Last {days} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.summary.events.toLocaleString() || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Custom events tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.summary.total.toLocaleString() || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Combined page views and events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {/* Daily Stats Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>Daily page views and events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[...(data?.dailyStats || [])].reverse()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value as string).toLocaleDateString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="pageviews"
                      stroke="#FF006E"
                      strokeWidth={2}
                      name="Page Views"
                    />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="#3A86FF"
                      strokeWidth={2}
                      name="Events"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : data?.topPages.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data?.topPages.slice(0, 5) || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="path"
                      width={120}
                      tickFormatter={(value) =>
                        value?.length > 15
                          ? `${value.substring(0, 15)}...`
                          : value || "/"
                      }
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF006E" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Events and Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Events */}
          <Card>
            <CardHeader>
              <CardTitle>Top Events</CardTitle>
              <CardDescription>Most frequent custom events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : data?.topEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No events recorded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {data?.topEvents.map((event, index) => (
                    <div
                      key={event.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="font-medium capitalize">
                          {event.name.replace(/_/g, " ")}
                        </span>
                      </div>
                      <Badge variant="secondary">{event.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest tracked events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : data?.recentEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {data?.recentEvents.slice(0, 10).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            event.type === "pageview" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {event.type}
                        </Badge>
                        <span className="truncate max-w-[150px]">
                          {event.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Privacy-First Analytics</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pink Beam uses privacy-friendly analytics. We don&apos;t use cookies,
                don&apos;t track personal information, and hash all IP addresses. This
                portal shows anonymous usage data only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
