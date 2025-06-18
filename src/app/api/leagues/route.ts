import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leagues = await prisma.fantasyLeague.findMany({
      where: {
        memberships: {
          some: {
            userId: session.user.id
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

    return NextResponse.json(leagues)
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
        creatorId: session.user.id,
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
            userId: session.user.id,
            teamName: `${session.user.email?.split("@")[0] || "User"}'s Team`,
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

    return NextResponse.json(league, { status: 201 })
  } catch (error) {
    console.error("Error creating league:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}