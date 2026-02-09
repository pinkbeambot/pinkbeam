import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { competitors, topics, sources } = await request.json()

    if (!sources || sources.length === 0) {
      return NextResponse.json({ error: 'No sources provided' }, { status: 400 })
    }

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-brief', {
      body: {
        userId: user.id,
        competitors: competitors || [],
        topics: topics || [],
        sources: sources
      }
    })

    if (error) {
      console.error('Edge function error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ briefId: data.briefId })
  } catch (error: unknown) {
    console.error('API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}