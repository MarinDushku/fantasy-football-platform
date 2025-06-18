import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDevSession } from "@/lib/devAuth"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    const leagues = await prisma.fantasyLeague.findMany({
      where: {
        memberships: {
          some: {
            userId: user.id
          }
        }
      },
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
            logoUrl: true
          }
        },
        memberships: {
          select: {
            id: true,
            teamName: true,
            totalPoints: true,
            gameweekPoints: true,
            leaguePosition: true,
            user: {
              select: {
                id: true,
                displayName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            memberships: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Convert BigInt values to strings for JSON serialization
    const serializedLeagues = leagues.map(league => ({
      ...league,
      budgetLimit: league.budgetLimit.toString(),
      entryFee: league.entryFee.toString(),
      prizePool: league.prizePool.toString(),
      memberships: league.memberships.map(membership => ({
        ...membership,
        totalPoints: membership.totalPoints,
        gameweekPoints: membership.gameweekPoints,
        leaguePosition: membership.leaguePosition
      }))
    }))

    return NextResponse.json(serializedLeagues)
  } catch (error) {
    console.error("Error fetching leagues:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      name,
      description,
      competitionId,
      leagueType,
      maxMembers,
      entryFee,
      selectionMethod,
      budgetLimit,
      squadSize,
      hasPlayoffs
    } = body

    // Basic validation
    if (!name || !competitionId) {
      return NextResponse.json(
        { error: "Name and competition are required" },
        { status: 400 }
      )
    }

    const league = await prisma.fantasyLeague.create({
      data: {
        name,
        description,
        creatorId: user.id,
        competitionId,
        leagueType: leagueType || "PRIVATE",
        maxMembers: maxMembers || 12,
        entryFee: entryFee || 0,
        selectionMethod: selectionMethod || "AUCTION",
        budgetLimit: budgetLimit || 100000000,
        squadSize: squadSize || 15,
        hasPlayoffs: hasPlayoffs !== false,
        memberships: {
          create: {
            userId: user.id,
            teamName: `${userEmail.split("@")[0] || "User"}'s Team`,
            isAdmin: true,
            remainingBudget: budgetLimit || 100000000
          }
        }
      },
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
            shortName: true
          }
        }
      }
    })

    // Convert BigInt values to strings for JSON serialization
    const serializedLeague = {
      ...league,
      budgetLimit: league.budgetLimit.toString(),
      entryFee: league.entryFee.toString(),
      prizePool: league.prizePool.toString()
    }

    return NextResponse.json(serializedLeague, { status: 201 })
  } catch (error) {
    console.error("Error creating league:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}