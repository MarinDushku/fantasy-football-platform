import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const position = searchParams.get("position")
    const teamId = searchParams.get("teamId")

    const skip = (page - 1) * limit

    const where = {
      isActive: true,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive"
        }
      }),
      ...(position && {
        position: position
      }),
      ...(teamId && {
        teamId: teamId
      })
    }

    const [players, totalCount] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logoUrl: true,
              competition: {
                select: {
                  id: true,
                  name: true,
                  shortName: true
                }
              }
            }
          }
        },
        orderBy: [
          { marketValueEuros: "desc" },
          { name: "asc" }
        ],
        skip,
        take: limit
      }),
      prisma.player.count({ where })
    ])

    return NextResponse.json({
      players,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}