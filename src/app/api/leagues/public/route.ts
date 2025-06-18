import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/leagues/public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""

    const where = {
      leagueType: 'PUBLIC' as const,
      status: {
        in: ['DRAFT', 'AUCTION']
      },
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as const
            }
          }
        ]
      })
    }

    const publicLeagues = await prisma.fantasyLeague.findMany({
      where,
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
      },
      orderBy: [
        { currentMembers: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // Filter out full leagues
    const availableLeagues = publicLeagues.filter(league => 
      league.currentMembers < league.maxMembers
    )

    // Convert BigInt values to strings for JSON serialization
    const serializedLeagues = availableLeagues.map(league => ({
      id: league.id,
      name: league.name,
      description: league.description,
      currentMembers: league.currentMembers,
      maxMembers: league.maxMembers,
      status: league.status,
      leagueType: league.leagueType,
      competition: league.competition,
      creator: league.creator,
      createdAt: league.createdAt.toISOString()
    }))

    return NextResponse.json(serializedLeagues)
  } catch (error) {
    console.error("Error fetching public leagues:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}