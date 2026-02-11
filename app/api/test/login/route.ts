import { NextResponse } from 'next/server'

export async function POST() {
  if (process.env.E2E_TEST !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: 'pb-e2e-auth',
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  })

  return response
}
