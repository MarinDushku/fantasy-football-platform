import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getDevSession } from '@/lib/devAuth'
import { prisma } from '@/lib/prisma'
import { MOCK_NEWS_DATA } from '@/lib/newsApi'
import { getTeamById } from '@/lib/teamsData'

// GET /api/news/personalized
export async function GET(request: NextRequest) {
  try {
    // Try NextAuth session first, then fall back to dev session
    const nextAuthSession = await getServerSession(authOptions)
    const devSession = await getDevSession()
    
    const userEmail = nextAuthSession?.user?.email || devSession?.user?.email
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get user's favorite teams
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        favoriteTeams: true,
        userPreferences: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user hasn't completed onboarding, redirect to onboarding
    if (!user.userPreferences?.hasCompletedOnboarding) {
      return NextResponse.json({ 
        error: 'Onboarding not completed',
        redirectTo: '/onboarding' 
      }, { status: 403 })
    }

    // Get team IDs from user's favorites
    const favoriteTeamIds = user.favoriteTeams.map(ft => ft.teamId)

    // Filter news based on user's favorite teams
    let personalizedNews = MOCK_NEWS_DATA

    if (favoriteTeamIds.length > 0) {
      // Filter news that mentions user's favorite teams
      personalizedNews = MOCK_NEWS_DATA.filter(article => {
        // Check if article title or description mentions any of the user's teams
        const content = `${article.title} ${article.description}`.toLowerCase()
        
        return favoriteTeamIds.some(teamId => {
          const team = getTeamById(teamId)
          if (!team) return false
          
          // Check for team name or short name in content
          return content.includes(team.name.toLowerCase()) ||
                 content.includes(team.shortName.toLowerCase()) ||
                 // For demo purposes, also include league-specific news
                 article.league === team.leagueId
        })
      })

      // If no personalized news found, include some league-specific news
      if (personalizedNews.length === 0) {
        const userLeagues = [...new Set(favoriteTeamIds.map(teamId => {
          const team = getTeamById(teamId)
          return team?.leagueId
        }).filter(Boolean))]

        personalizedNews = MOCK_NEWS_DATA.filter(article => 
          userLeagues.includes(article.league || '')
        )
      }
    }

    // Sort by recency and limit results
    const sortedNews = personalizedNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)

    // Add personalization metadata
    const response = {
      news: sortedNews,
      personalization: {
        favoriteTeamsCount: favoriteTeamIds.length,
        favoriteTeams: favoriteTeamIds.map(teamId => {
          const team = getTeamById(teamId)
          return team ? {
            id: team.id,
            name: team.name,
            shortName: team.shortName,
            league: team.league
          } : null
        }).filter(Boolean),
        totalAvailable: personalizedNews.length,
        isPersonalized: favoriteTeamIds.length > 0
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching personalized news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}