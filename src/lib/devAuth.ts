import { cookies } from 'next/headers'

export interface DevSession {
  user: {
    id: string
    email: string
    name: string
  }
}

export async function getDevSession(): Promise<DevSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('dev-session')
    
    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value) as DevSession
    return session
  } catch (error) {
    console.error('Error parsing dev session:', error)
    return null
  }
}

export async function clearDevSession() {
  const cookieStore = await cookies()
  cookieStore.delete('dev-session')
}