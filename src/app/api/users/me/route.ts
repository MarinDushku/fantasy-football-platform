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

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        countryCode: true,
        timezone: true,
        preferredLanguage: true,
        isPremium: true,
        premiumExpiresAt: true,
        totalExperiencePoints: true,
        reputationScore: true,
        createdAt: true,
        lastActiveAt: true,
        _count: {
          select: {
            createdLeagues: true,
            leagueMemberships: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const nextAuthSession = await getServerSession(authOptions)
    const devSession = await getDevSession()
    
    const userEmail = nextAuthSession?.user?.email || devSession?.user?.email
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      username,
      displayName,
      bio,
      countryCode,
      timezone,
      preferredLanguage
    } = body

    const user = await prisma.user.update({
      where: {
        email: userEmail
      },
      data: {
        ...(username && { username }),
        ...(displayName && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(countryCode && { countryCode }),
        ...(timezone && { timezone }),
        ...(preferredLanguage && { preferredLanguage }),
        lastActiveAt: new Date()
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        countryCode: true,
        timezone: true,
        preferredLanguage: true,
        isPremium: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}