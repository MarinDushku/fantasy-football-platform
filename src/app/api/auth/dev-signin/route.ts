import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// POST /api/auth/dev-signin
export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        userPreferences: true
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          displayName: name || email.split('@')[0],
          emailVerified: true
        },
        include: {
          userPreferences: true
        }
      })
    }

    // Create a simple session cookie for development
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.displayName
      }
    }

    const cookieStore = await cookies()
    
    // Set session cookie (in production, this would be more secure)
    cookieStore.set('dev-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.displayName
      },
      hasCompletedOnboarding: user.userPreferences?.hasCompletedOnboarding || false
    })
  } catch (error) {
    console.error('Error in dev sign in:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}