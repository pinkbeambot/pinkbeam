import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Skip auth check - we're using service role
  // The API route already verified the user

  try {
    const { userId, competitors, topics, sources } = await req.json()

    if (!userId || !sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Fetch content from all sources using Jina AI
    const sourceContents = await Promise.all(
      sources.map(async (url: string) => {
        try {
          const jinaUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`
          const response = await fetch(jinaUrl)
          if (response.ok) {
            const content = await response.text()
            return { url, content: content.slice(0, 5000) } // Limit content length
          }
          return { url, content: '' }
        } catch (e) {
          return { url, content: '' }
        }
      })
    )

    // Filter out failed fetches
    const validSources = sourceContents.filter(s => s.content.length > 100)

    if (validSources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Could not fetch any sources' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare prompt for OpenAI
    const sourcesText = validSources.map(s => `Source: ${s.url}\n\n${s.content}`).join('\n\n---\n\n')
    
    const prompt = `You are Sarah, a market intelligence analyst. Generate a structured research brief based on the following sources.

Competitors to focus on: ${competitors.join(', ') || 'None specified'}
Topics of interest: ${topics.join(', ') || 'None specified'}

Sources:
${sourcesText}

Generate a structured brief with the following sections. Return ONLY valid JSON:

{
  "title": "Brief title with date",
  "executiveSummary": ["2-3 key takeaways"],
  "competitorActivity": ["Bullet points about competitor moves"],
  "industryTrends": ["Relevant trends spotted"],
  "keyInsights": ["Strategic insights"],
  "recommendedActions": ["Suggested next steps"]
}

Be concise and actionable. Focus on information relevant to the specified competitors and topics.`

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a market intelligence analyst. Generate structured, actionable briefs.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI error:', errorText)
      return new Response(
        JSON.stringify({ error: 'OpenAI API error', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    const generatedContent = openaiData.choices[0].message.content

    // Parse JSON from response
    let briefContent
    try {
      // Extract JSON if wrapped in markdown
      const jsonMatch = generatedContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                        generatedContent.match(/({[\s\S]*})/)
      const jsonStr = jsonMatch ? jsonMatch[1] : generatedContent
      briefContent = JSON.parse(jsonStr)
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      // Fallback: create structure from raw text
      briefContent = {
        title: `Market Intelligence Brief - ${new Date().toLocaleDateString()}`,
        executiveSummary: [generatedContent.slice(0, 200)],
        competitorActivity: [],
        industryTrends: [],
        keyInsights: [],
        recommendedActions: []
      }
    }

    // Get user email from auth
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    const userEmail = authUser?.email || 'user@example.com'

    // Store brief in database
    const { data: brief, error: dbError } = await supabaseAdmin
      .from('briefs')
      .insert({
        user_id: userId,
        title: briefContent.title || `Market Intelligence Brief - ${new Date().toLocaleDateString()}`,
        content: {
          executiveSummary: briefContent.executiveSummary || [],
          competitorActivity: briefContent.competitorActivity || [],
          industryTrends: briefContent.industryTrends || [],
          keyInsights: briefContent.keyInsights || [],
          recommendedActions: briefContent.recommendedActions || [],
        },
        sources: validSources.map(s => s.url),
        status: 'draft'
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save brief', details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email via Resend
    try {
      const emailHtml = `
        <h1>${briefContent.title || 'Research Brief'}</h1>
        <h2>Executive Summary</h2>
        <ul>
          ${(briefContent.executiveSummary || []).map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
        <h2>Sources</h2>
        <ul>
          ${validSources.map(s => `<li><a href="${s.url}">${s.url}</a></li>`).join('')}
        </ul>
        <hr>
        <p>Generated by Sarah, your AI Market Intelligence Analyst</p>
        <p><a href="https://pinkbeam.io/dashboard/briefs/${brief.id}">View full brief</a></p>
      `

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Sarah at Pink Beam <sarah@pinkbeam.io>',
          to: [userEmail],
          subject: briefContent.title || 'Your Research Brief',
          html: emailHtml,
        }),
      })

      if (resendResponse.ok) {
        // Update brief status to sent
        await supabaseAdmin
          .from('briefs')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', brief.id)
      }
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail if email doesn't send, brief is still saved
    }

    return new Response(
      JSON.stringify({ briefId: brief.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})