import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { briefId } = await request.json()

    // Get the brief
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', briefId)
      .eq('user_id', user.id)
      .single()

    if (briefError || !brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    // Call the Edge Function to send email
    const { error } = await supabase.functions.invoke('send-brief-email', {
      body: {
        briefId: brief.id,
        userId: user.id,
        email: user.email,
        title: brief.title,
        content: brief.content
      }
    })

    if (error) {
      console.error('Edge function error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update brief status
    await supabase
      .from('briefs')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', briefId)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}