// Teams data for top 5 leagues + international competitions
export interface TeamData {
  id: string
  name: string
  shortName: string
  logoUrl: string
  league: string
  leagueId: string
  country: string
  primaryColor: string
  secondaryColor?: string
}

export const LEAGUES = {
  'premier-league': {
    id: 'premier-league',
    name: 'Premier League',
    country: 'England',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: 'text-purple-600'
  },
  'la-liga': {
    id: 'la-liga', 
    name: 'La Liga',
    country: 'Spain',
    emoji: '🇪🇸',
    color: 'text-red-600'
  },
  'serie-a': {
    id: 'serie-a',
    name: 'Serie A', 
    country: 'Italy',
    emoji: '🇮🇹',
    color: 'text-green-600'
  },
  'bundesliga': {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany', 
    emoji: '🇩🇪',
    color: 'text-yellow-600'
  },
  'ligue-1': {
    id: 'ligue-1',
    name: 'Ligue 1',
    country: 'France',
    emoji: '🇫🇷', 
    color: 'text-blue-600'
  }
}

export const TEAMS_DATA: TeamData[] = [
  // Premier League
  { id: 'man-city', name: 'Manchester City', shortName: 'MCI', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#6CABDD' },
  { id: 'arsenal', name: 'Arsenal', shortName: 'ARS', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#EF0107' },
  { id: 'liverpool', name: 'Liverpool', shortName: 'LIV', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#C8102E' },
  { id: 'man-united', name: 'Manchester United', shortName: 'MUN', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#DA020E' },
  { id: 'chelsea', name: 'Chelsea', shortName: 'CHE', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#034694' },
  { id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'TOT', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#132257' },
  { id: 'newcastle', name: 'Newcastle United', shortName: 'NEW', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Newcastle-United-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#241F20' },
  { id: 'aston-villa', name: 'Aston Villa', shortName: 'AVL', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Aston-Villa-Logo.png', league: 'Premier League', leagueId: 'premier-league', country: 'England', primaryColor: '#670E36' },

  // La Liga
  { id: 'real-madrid', name: 'Real Madrid', shortName: 'RMA', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png', league: 'La Liga', leagueId: 'la-liga', country: 'Spain', primaryColor: '#FFFFFF', secondaryColor: '#000000' },
  { id: 'barcelona', name: 'FC Barcelona', shortName: 'BAR', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png', league: 'La Liga', leagueId: 'la-liga', country: 'Spain', primaryColor: '#A50044' },
  { id: 'atletico-madrid', name: 'Atlético Madrid', shortName: 'ATM', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Atletico-Madrid-Logo.png', league: 'La Liga', leagueId: 'la-liga', country: 'Spain', primaryColor: '#CE3524' },
  { id: 'sevilla', name: 'Sevilla FC', shortName: 'SEV', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Sevilla-Logo.png', league: 'La Liga', leagueId: 'la-liga', country: 'Spain', primaryColor: '#D71920' },
  { id: 'valencia', name: 'Valencia CF', shortName: 'VAL', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Valencia-Logo.png', league: 'La Liga', leagueId: 'la-liga', country: 'Spain', primaryColor: '#FF8C00' },
  { id: 'villarreal', name: 'Villarreal CF', shortName: 'VIL', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Villarreal-Logo.png', league: 'La Liga', leagueId: 'la-liga', country: 'Spain', primaryColor: '#FFE500' },

  // Serie A
  { id: 'juventus', name: 'Juventus', shortName: 'JUV', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png', league: 'Serie A', leagueId: 'serie-a', country: 'Italy', primaryColor: '#000000' },
  { id: 'inter-milan', name: 'Inter Milan', shortName: 'INT', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Inter-Milan-Logo.png', league: 'Serie A', leagueId: 'serie-a', country: 'Italy', primaryColor: '#0068A8' },
  { id: 'ac-milan', name: 'AC Milan', shortName: 'MIL', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/AC-Milan-Logo.png', league: 'Serie A', leagueId: 'serie-a', country: 'Italy', primaryColor: '#FB090B' },
  { id: 'napoli', name: 'SSC Napoli', shortName: 'NAP', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Napoli-Logo.png', league: 'Serie A', leagueId: 'serie-a', country: 'Italy', primaryColor: '#087BC4' },
  { id: 'roma', name: 'AS Roma', shortName: 'ROM', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/AS-Roma-Logo.png', league: 'Serie A', leagueId: 'serie-a', country: 'Italy', primaryColor: '#CC2129' },
  { id: 'lazio', name: 'SS Lazio', shortName: 'LAZ', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Lazio-Logo.png', league: 'Serie A', leagueId: 'serie-a', country: 'Italy', primaryColor: '#87CEEB' },

  // Bundesliga
  { id: 'bayern-munich', name: 'Bayern Munich', shortName: 'BAY', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Bayern-Munich-Logo.png', league: 'Bundesliga', leagueId: 'bundesliga', country: 'Germany', primaryColor: '#DC052D' },
  { id: 'borussia-dortmund', name: 'Borussia Dortmund', shortName: 'BVB', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png', league: 'Bundesliga', leagueId: 'bundesliga', country: 'Germany', primaryColor: '#FDE100' },
  { id: 'rb-leipzig', name: 'RB Leipzig', shortName: 'RBL', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/RB-Leipzig-Logo.png', league: 'Bundesliga', leagueId: 'bundesliga', country: 'Germany', primaryColor: '#DD0741' },
  { id: 'bayer-leverkusen', name: 'Bayer Leverkusen', shortName: 'B04', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Bayer-Leverkusen-Logo.png', league: 'Bundesliga', leagueId: 'bundesliga', country: 'Germany', primaryColor: '#E32221' },
  { id: 'eintracht-frankfurt', name: 'Eintracht Frankfurt', shortName: 'SGE', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Eintracht-Frankfurt-Logo.png', league: 'Bundesliga', leagueId: 'bundesliga', country: 'Germany', primaryColor: '#E1000F' },

  // Ligue 1
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/PSG-Logo.png', league: 'Ligue 1', leagueId: 'ligue-1', country: 'France', primaryColor: '#004170' },
  { id: 'marseille', name: 'Olympique Marseille', shortName: 'OM', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Marseille-Logo.png', league: 'Ligue 1', leagueId: 'ligue-1', country: 'France', primaryColor: '#009BDB' },
  { id: 'lyon', name: 'Olympique Lyon', shortName: 'OL', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Lyon-Logo.png', league: 'Ligue 1', leagueId: 'ligue-1', country: 'France', primaryColor: '#CC092F' },
  { id: 'monaco', name: 'AS Monaco', shortName: 'ASM', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Monaco-Logo.png', league: 'Ligue 1', leagueId: 'ligue-1', country: 'France', primaryColor: '#CC092F' },
  { id: 'lille', name: 'Lille OSC', shortName: 'LOSC', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Lille-Logo.png', league: 'Ligue 1', leagueId: 'ligue-1', country: 'France', primaryColor: '#D20A2E' },
  { id: 'nice', name: 'OGC Nice', shortName: 'NICE', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Nice-Logo.png', league: 'Ligue 1', leagueId: 'ligue-1', country: 'France', primaryColor: '#D20A2E' }
]

export const getTeamsByLeague = (leagueId: string): TeamData[] => {
  return TEAMS_DATA.filter(team => team.leagueId === leagueId)
}

export const getTeamById = (teamId: string): TeamData | undefined => {
  return TEAMS_DATA.find(team => team.id === teamId)
}

export const getAllLeagues = () => {
  return Object.values(LEAGUES)
}