import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDevSession } from "@/lib/devAuth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: {
    leagueId: string
  }
}

// POST /api/leagues/[leagueId]/join
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const nextAuthSession = await getServerSession(authOptions)
    const devSession = await getDevSession()
    
    const userEmail = nextAuthSession?.user?.email || devSession?.user?.email
    const userName = nextAuthSession?.user?.name || devSession?.user?.name
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { leagueId } = params
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          displayName: userName || userEmail.split('@')[0]
        }
      })
    }

    // Check if league exists and is available
    const league = await prisma.fantasyLeague.findUnique({
      where: { id: leagueId }
    })

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 })
    }

    // Check if league is full
    if (league.currentMembers >= league.maxMembers) {
      return NextResponse.json({ error: "League is full" }, { status: 400 })
    }

    // Check if league is accepting new members
    if (league.status !== 'DRAFT' && league.status !== 'AUCTION') {
      return NextResponse.json({ error: "League is no longer accepting new members" }, { status: 400 })
    }

    // Check if user is already in the league
    const existingMembership = await prisma.leagueMembership.findUnique({
      where: {
        leagueId_userId: {
          leagueId: leagueId,
          userId: user.id
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json({ error: "You are already a member of this league" }, { status: 400 })
    }

    // Add user to league
    const membership = await prisma.leagueMembership.create({
      data: {
        leagueId: leagueId,
        userId: user.id,
        teamName: `${user.displayName || user.email.split('@')[0]}'s Team`,
        remainingBudget: league.budgetLimit,
        isAdmin: false
      }
    })

    // Update league member count
    await prisma.fantasyLeague.update({
      where: { id: leagueId },
      data: {
        currentMembers: {
          increment: 1
        }
      }
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        leagueId: leagueId,
        actionType: 'DRAFT_PICK', // Using existing enum value
        description: `${user.displayName || user.email} joined the league`,
        metadata: {
          action: 'league_join',
          membershipId: membership.id
        }
      }
    })

    // Mark any league invitation notifications as read
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        leagueId: leagueId,
        type: 'LEAGUE_INVITE',
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: "Successfully joined the league!",
      membership: {
        id: membership.id,
        teamName: membership.teamName,
        leagueId: leagueId
      }
    })

  } catch (error) {
    console.error("Error joining league:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}