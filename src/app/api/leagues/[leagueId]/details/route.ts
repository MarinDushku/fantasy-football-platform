import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDevSession } from "@/lib/devAuth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    const nextAuthSession = await getServerSession(authOptions)
    const devSession = await getDevSession()
    
    const userEmail = nextAuthSession?.user?.email || devSession?.user?.email
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user first
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const leagueId = params.leagueId

    // Fetch league details with all related data
    const league = await prisma.fantasyLeague.findUnique({
      where: { id: leagueId },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            email: true
          }
        },
        competition: {
          select: {
            id: true,
            name: true,
            shortName: true,
            country: true
          }
        },
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true,
                totalExperiencePoints: true
              }
            }
          },
          orderBy: [
            { leaguePosition: 'asc' },
            { totalPoints: 'desc' }
          ]
        },
        scoringRules: {
          select: {
            goalPoints: true,
            assistPoints: true,
            cleanSheetGkPoints: true,
            yellowCardPoints: true,
            redCardPoints: true
          }
        }
      }
    })

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 })
    }

    // Check if user is a member of this league
    const userMembership = league.memberships.find(m => m.userId === user.id)
    if (!userMembership) {
      return NextResponse.json({ error: "You are not a member of this league" }, { status: 403 })
    }

    // Determine user's role in the league
    const currentUser = {
      id: user.id,
      email: user.email,
      isLeagueAdmin: userMembership.isAdmin,
      isLeagueCreator: league.creatorId === user.id
    }

    // Convert BigInt values to strings for JSON serialization
    const serializedLeague = {
      id: league.id,
      name: league.name,
      description: league.description,
      creatorId: league.creatorId,
      currentMembers: league.currentMembers,
      maxMembers: league.maxMembers,
      budgetLimit: league.budgetLimit.toString(),
      squadSize: league.squadSize,
      status: league.status,
      leagueType: league.leagueType,
      selectionMethod: league.selectionMethod,
      hasPlayoffs: league.hasPlayoffs,
      createdAt: league.createdAt.toISOString(),
      competition: league.competition,
      creator: league.creator,
      memberships: league.memberships.map(membership => ({
        id: membership.id,
        userId: membership.userId,
        teamName: membership.teamName,
        totalPoints: membership.totalPoints,
        gameweekPoints: membership.gameweekPoints,
        leaguePosition: membership.leaguePosition,
        isAdmin: membership.isAdmin,
        joinedAt: membership.joinedAt.toISOString(),
        user: membership.user
      })),
      scoringRules: league.scoringRules
    }

    return NextResponse.json({
      league: serializedLeague,
      currentUser
    })
  } catch (error) {
    console.error("Error fetching league details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}