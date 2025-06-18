import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getDevSession } from '@/lib/devAuth'
import { prisma } from '@/lib/prisma'

// GET /api/user/preferences
export async function GET(request: NextRequest) {
  try {
    const nextAuthSession = await getServerSession(authOptions)
    const devSession = await getDevSession()
    
    const userEmail = nextAuthSession?.user?.email || devSession?.user?.email
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        userPreferences: true,
        favoriteTeams: {
          include: {
            team: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      },
      preferences: user.userPreferences,
      favoriteTeams: user.favoriteTeams.map(ft => ({
        id: ft.id,
        teamId: ft.teamId,
        priority: ft.priority,
        team: {
          id: ft.team.id,
          name: ft.team.name,
          shortName: ft.team.shortName,
          logoUrl: ft.team.logoUrl,
          competitionId: ft.team.competitionId
        }
      }))
    })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user/preferences
export async function POST(request: NextRequest) {
  try {
    const nextAuthSession = await getServerSession(authOptions)
    const devSession = await getDevSession()
    
    const userEmail = nextAuthSession?.user?.email || devSession?.user?.email
    const userName = nextAuthSession?.user?.name || devSession?.user?.name
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { selectedTeams, newsFrequency, notificationsEnabled } = await request.json()

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          displayName: userName || userEmail
        }
      })
    }

    // Create or update user preferences
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        hasCompletedOnboarding: true,
        newsFrequency,
        notificationsEnabled,
        emailNotifications: notificationsEnabled,
        pushNotifications: notificationsEnabled
      },
      create: {
        userId: user.id,
        hasCompletedOnboarding: true,
        newsFrequency,
        notificationsEnabled,
        emailNotifications: notificationsEnabled,
        pushNotifications: notificationsEnabled
      }
    })

    // Clear existing favorite teams
    await prisma.userFavoriteTeam.deleteMany({
      where: { userId: user.id }
    })

    // Add new favorite teams
    if (selectedTeams && selectedTeams.length > 0) {
      const teamData = selectedTeams.map((teamId: string, index: number) => ({
        userId: user.id,
        teamId: teamId, // Use actual team IDs from database
        priority: index + 1
      }))

      await prisma.userFavoriteTeam.createMany({
        data: teamData
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Preferences saved successfully' 
    })
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}