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

// POST /api/leagues/[leagueId]/invite
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const { leagueId } = params
    const body = await request.json()
    const { username, email, type } = body

    // Check if user is admin of the league
    const league = await prisma.fantasyLeague.findUnique({
      where: { id: leagueId },
      include: {
        memberships: {
          where: { userId: user.id }
        }
      }
    })

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 })
    }

    const userMembership = league.memberships[0]
    if (!userMembership || !userMembership.isAdmin) {
      return NextResponse.json({ error: "Only league admins can send invitations" }, { status: 403 })
    }

    // Check if league is full
    if (league.currentMembers >= league.maxMembers) {
      return NextResponse.json({ error: "League is full" }, { status: 400 })
    }

    if (type === 'username') {
      // Invite by username
      if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 })
      }

      // Find user by username
      const targetUser = await prisma.user.findUnique({
        where: { username: username }
      })

      if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Check if user is already in the league
      const existingMembership = await prisma.leagueMembership.findUnique({
        where: {
          leagueId_userId: {
            leagueId: leagueId,
            userId: targetUser.id
          }
        }
      })

      if (existingMembership) {
        return NextResponse.json({ error: "User is already in this league" }, { status: 400 })
      }

      // Create notification for the invited user
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          type: 'LEAGUE_INVITE',
          title: 'League Invitation',
          content: `You've been invited to join "${league.name}"`,
          leagueId: leagueId,
          relatedUserId: user.id,
          actionUrl: `/leagues/${leagueId}/join?invite=true`
        }
      })

      return NextResponse.json({ 
        success: true,
        message: `Invitation sent to ${username}` 
      })

    } else if (type === 'email') {
      // Invite by email
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email }
      })

      if (existingUser) {
        // Check if already in league
        const existingMembership = await prisma.leagueMembership.findUnique({
          where: {
            leagueId_userId: {
              leagueId: leagueId,
              userId: existingUser.id
            }
          }
        })

        if (existingMembership) {
          return NextResponse.json({ error: "User is already in this league" }, { status: 400 })
        }

        // Create notification for existing user
        await prisma.notification.create({
          data: {
            userId: existingUser.id,
            type: 'LEAGUE_INVITE',
            title: 'League Invitation',
            content: `You've been invited to join "${league.name}"`,
            leagueId: leagueId,
            relatedUserId: user.id,
            actionUrl: `/leagues/${leagueId}/join?invite=true`
          }
        })
      } else {
        // For new users, we would typically send an email invitation
        // For now, we'll just return success (in a real app, you'd integrate with an email service)
        console.log(`Would send email invitation to ${email} for league ${league.name}`)
      }

      return NextResponse.json({ 
        success: true,
        message: `Invitation sent to ${email}` 
      })
    }

    return NextResponse.json({ error: "Invalid invitation type" }, { status: 400 })

  } catch (error) {
    console.error("Error sending invitation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/leagues/[leagueId]/invite - Get invitation details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { leagueId } = params

    const league = await prisma.fantasyLeague.findUnique({
      where: { id: leagueId },
      include: {
        competition: {
          select: {
            name: true,
            shortName: true
          }
        },
        creator: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    })

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 })
    }

    // Check if league is accepting new members
    if (league.currentMembers >= league.maxMembers) {
      return NextResponse.json({ error: "League is full" }, { status: 400 })
    }

    if (league.status !== 'DRAFT' && league.status !== 'AUCTION') {
      return NextResponse.json({ error: "League is no longer accepting new members" }, { status: 400 })
    }

    return NextResponse.json({
      id: league.id,
      name: league.name,
      description: league.description,
      competition: league.competition,
      creator: league.creator,
      currentMembers: league.currentMembers,
      maxMembers: league.maxMembers,
      status: league.status,
      leagueType: league.leagueType
    })

  } catch (error) {
    console.error("Error fetching invitation details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}