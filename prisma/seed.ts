import { PrismaClient } from '@prisma/client'
import { LEAGUES, TEAMS_DATA } from '../src/lib/teamsData'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create competitions (leagues)
  console.log('📊 Creating competitions...')
  for (const league of Object.values(LEAGUES)) {
    await prisma.competition.upsert({
      where: { id: league.id },
      update: {},
      create: {
        id: league.id,
        name: league.name,
        shortName: league.id.substring(0, 10).toUpperCase(),
        country: league.country,
        season: '2024-25',
        isActive: true,
        priority: 1
      }
    })
    console.log(`✅ Created competition: ${league.name}`)
  }

  // Create teams
  console.log('🏟️ Creating teams...')
  for (const teamData of TEAMS_DATA) {
    await prisma.team.upsert({
      where: { id: teamData.id },
      update: {},
      create: {
        id: teamData.id,
        name: teamData.name,
        shortName: teamData.shortName,
        logoUrl: teamData.logoUrl,
        competitionId: teamData.leagueId,
        country: teamData.country,
        primaryColor: teamData.primaryColor,
        secondaryColor: teamData.secondaryColor,
        isActive: true
      }
    })
    console.log(`✅ Created team: ${teamData.name}`)
  }

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })