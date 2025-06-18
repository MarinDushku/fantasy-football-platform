import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDevSession } from "@/lib/devAuth"
import { prisma } from "@/lib/prisma"

export async function POST(
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

    // Fetch league to verify user permissions and current status
    const league = await prisma.fantasyLeague.findUnique({
      where: { id: leagueId },
      include: {
        memberships: {
          select: {
            userId: true,
            isAdmin: true
          }
        }
      }
    })

    if (!league) {
      return NextResponse.json({ error: "League not found" }, { status: 404 })
    }

    // Check if user is the league creator
    if (league.creatorId !== user.id) {
      return NextResponse.json({ error: "Only the league creator can start the draft" }, { status: 403 })
    }

    // Check if league is in draft status
    if (league.status !== 'DRAFT') {
      return NextResponse.json({ error: "League is not in draft status" }, { status: 400 })
    }

    // Check if league has minimum members (at least 2)
    if (league.currentMembers < 2) {
      return NextResponse.json({ error: "League needs at least 2 members to start draft" }, { status: 400 })
    }

    // Update league status based on selection method
    const newStatus = league.selectionMethod === 'AUCTION' ? 'AUCTION' : 'ACTIVE'
    
    const updatedLeague = await prisma.fantasyLeague.update({
      where: { id: leagueId },
      data: {
        status: newStatus,
        draftStartedAt: new Date()
      }
    })

    // TODO: In a full implementation, you would also:
    // 1. Create a draft room/session
    // 2. Set up draft order for snake drafts
    // 3. Initialize auction timer for auction drafts
    // 4. Send notifications to all league members
    // 5. Create draft logs/events

    return NextResponse.json({
      success: true,
      message: `Draft started successfully! League status updated to ${newStatus}`,
      leagueStatus: newStatus
    })
  } catch (error) {
    console.error("Error starting draft:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}