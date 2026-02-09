'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestConnectionPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const supabase = createClient()
      
      // Test 1: Check if we can get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        setResult(`Session Error: ${sessionError.message}`)
        setLoading(false)
        return
      }
      
      // Test 2: Try to sign up with a test account
      const testEmail = `test${Date.now()}@example.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123'
      })
      
      if (error) {
        setResult(`Sign Up Error: ${error.message}\nCode: ${error.status || 'N/A'}`)
      } else {
        setResult(`Success! User created:\nEmail: ${testEmail}\nUser ID: ${data.user?.id || 'N/A'}\nSession: ${data.session ? 'Yes' : 'No'}`)
      }
    } catch (err: any) {
      setResult(`Fetch Error: ${err.message}\nThis is likely a CORS or network issue.`)
    }
    
    setLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>Debug the auth connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>URL:</strong> https://ovtgrsdswwzkojzvotoa.supabase.co</p>
            <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20)}...</p>
          </div>
          
          <Button onClick={testConnection} disabled={loading} className="w-full">
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
          
          {result && (
            <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}