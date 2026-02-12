'use client'

import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Video,
  Phone,
  ArrowLeft,
  Plus,
  Users,
  MapPin,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'
import type { User } from '@supabase/supabase-js'

interface ScheduleViewProps {
  user: User
}

// Mock data - will be replaced with real API calls
const upcomingMeetings = [
  { 
    id: '1', 
    title: 'Strategy Review Call', 
    date: '2026-02-10',
    time: '2:00 PM - 3:00 PM',
    duration: '60 min',
    type: 'video',
    attendees: ['Sarah Chen', 'You'],
    engagement: 'Digital Transformation Strategy',
    status: 'confirmed'
  },
  { 
    id: '2', 
    title: 'Weekly Sync', 
    date: '2026-02-12',
    time: '10:00 AM - 10:30 AM',
    duration: '30 min',
    type: 'video',
    attendees: ['Marcus Johnson', 'You'],
    engagement: 'Process Automation Assessment',
    status: 'confirmed'
  },
  { 
    id: '3', 
    title: 'Q1 Planning Session', 
    date: '2026-02-16',
    time: '9:00 AM - 11:00 AM',
    duration: '120 min',
    type: 'in-person',
    location: 'Pink Beam Office - 123 Main St',
    attendees: ['Sarah Chen', 'Marcus Johnson', 'You'],
    engagement: 'Digital Transformation Strategy',
    status: 'pending'
  },
  { 
    id: '4', 
    title: 'Architecture Review', 
    date: '2026-02-20',
    time: '3:00 PM - 4:00 PM',
    duration: '60 min',
    type: 'video',
    attendees: ['James Wilson', 'You'],
    engagement: 'Technology Architecture Review',
    status: 'confirmed'
  },
]

const pastMeetings = [
  { 
    id: '5', 
    title: 'Discovery Workshop', 
    date: '2026-02-03',
    time: '1:00 PM - 3:00 PM',
    duration: '120 min',
    type: 'video',
    attendees: ['Marcus Johnson', 'You'],
    engagement: 'Process Automation Assessment',
    status: 'completed'
  },
  { 
    id: '6', 
    title: 'Kickoff Meeting', 
    date: '2026-01-15',
    time: '10:00 AM - 11:00 AM',
    duration: '60 min',
    type: 'video',
    attendees: ['Sarah Chen', 'You'],
    engagement: 'Digital Transformation Strategy',
    status: 'completed'
  },
]

function getMeetingTypeIcon(type: string) {
  switch (type) {
    case 'video':
      return <Video className="w-4 h-4" />
    case 'phone':
      return <Phone className="w-4 h-4" />
    case 'in-person':
      return <MapPin className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'confirmed': 'bg-green-500/10 text-green-500 border-green-500/20',
    'pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'completed': 'bg-muted text-muted-foreground',
    'cancelled': 'bg-destructive/10 text-destructive',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function MeetingCard({ meeting }: { meeting: typeof upcomingMeetings[0] }) {
  const meetingDate = new Date(meeting.date)
  const isToday = new Date().toDateString() === meetingDate.toDateString()
  
  return (
    <Card className={meeting.status === 'completed' ? 'opacity-75' : ''}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Date Block */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-amber-500/10 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-amber-500 font-medium uppercase">{meetingDate.toLocaleString('default', { month: 'short' })}</span>
              <span className="text-xl font-bold text-amber-500">{meetingDate.getDate()}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{meeting.title}</h3>
                  <Badge variant="outline" className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                  {isToday && (
                    <Badge variant="secondary" className="bg-amber-500 text-white">Today</Badge>
                  )}
                </div>
                <p className="text-sm text-amber-500 mb-2">{meeting.engagement}</p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{meeting.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {getMeetingTypeIcon(meeting.type)}
                <span className="capitalize">{meeting.type.replace('-', ' ')}</span>
              </div>
              {meeting.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{meeting.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                  <div 
                    key={idx} 
                    className="w-7 h-7 rounded-full bg-amber-500/20 border-2 border-background flex items-center justify-center"
                    title={attendee}
                  >
                    <span className="text-xs font-medium text-amber-500">
                      {attendee.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                ))}
                {meeting.attendees.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs">+{meeting.attendees.length - 3}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex sm:flex-col gap-2">
            {meeting.status !== 'completed' && meeting.type === 'video' && (
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                <Video className="w-4 h-4 mr-1.5" />
                Join
              </Button>
            )}
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ScheduleView({ user }: ScheduleViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/portal/admin/solutions">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Schedule</h1>
              <p className="text-muted-foreground">Manage your meetings and calls</p>
            </div>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" />
            Schedule a Call
          </Button>
        </div>
      </FadeIn>

      {/* Quick Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Past Meetings</p>
                  <p className="text-2xl font-bold">{pastMeetings.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Upcoming Meetings */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Your scheduled calls and meetings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Past Meetings */}
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Past Meetings</CardTitle>
            <CardDescription>Your completed meetings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Schedule CTA */}
      <FadeIn delay={0.4}>
        <Card className="bg-gradient-to-r from-amber-600 to-amber-500 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold mb-1">Need to schedule a call?</h3>
                <p className="text-white/80 text-sm">
                  Book a time that works for you and your consultant
                </p>
              </div>
              <Button variant="secondary">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
