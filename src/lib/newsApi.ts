// Football News API integration
export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    id: string
    name: string
  }
  league?: string
  category?: string
}

export interface NewsFilters {
  league?: string
  category?: string
  dateRange?: 'today' | 'week' | 'month'
}

// Football leagues and competitions
export const FOOTBALL_LEAGUES = {
  'premier-league': { name: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'text-purple-600' },
  'la-liga': { name: 'La Liga', emoji: '🇪🇸', color: 'text-red-600' },
  'serie-a': { name: 'Serie A', emoji: '🇮🇹', color: 'text-green-600' },
  'bundesliga': { name: 'Bundesliga', emoji: '🇩🇪', color: 'text-yellow-600' },
  'ligue-1': { name: 'Ligue 1', emoji: '🇫🇷', color: 'text-blue-600' },
  'champions-league': { name: 'Champions League', emoji: '⭐', color: 'text-blue-700' },
  'europa-league': { name: 'Europa League', emoji: '🌟', color: 'text-orange-600' },
  'world-cup': { name: 'World Cup', emoji: '🏆', color: 'text-gold-600' },
  'euro-cup': { name: 'Euro Cup', emoji: '🇪🇺', color: 'text-indigo-600' },
}

// Mock news data for demonstration (in production, this would come from a real API)
export const MOCK_NEWS_DATA: NewsArticle[] = [
  {
    id: '1',
    title: 'Manchester City defeats Arsenal 2-1 in Premier League thriller',
    description: 'A stunning late goal from Erling Haaland secured victory for City at the Etihad Stadium in what was a captivating encounter.',
    content: 'Manchester City came from behind to defeat Arsenal 2-1 in a thrilling Premier League encounter...',
    url: 'https://example.com/city-arsenal',
    urlToImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: { id: 'bbc-sport', name: 'BBC Sport' },
    league: 'premier-league',
    category: 'match-result'
  },
  {
    id: '2',
    title: 'Real Madrid signs new wonderkid from Brazilian club',
    description: 'The Spanish giants have completed the signing of 18-year-old midfielder for €50 million.',
    content: 'Real Madrid have announced the signing of Brazilian midfielder...',
    url: 'https://example.com/real-madrid-signing',
    urlToImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: { id: 'marca', name: 'Marca' },
    league: 'la-liga',
    category: 'transfer'
  },
  {
    id: '3',
    title: 'Champions League draw: English clubs learn their fate',
    description: 'The Champions League Round of 16 draw has been completed with some fascinating matchups.',
    content: 'The Champions League Round of 16 draw took place in Nyon...',
    url: 'https://example.com/champions-league-draw',
    urlToImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { id: 'uefa', name: 'UEFA' },
    league: 'champions-league',
    category: 'tournament'
  },
  {
    id: '4',
    title: 'Bayern Munich dominates Borussia Dortmund in Der Klassiker',
    description: 'Bayern Munich secured a commanding 3-0 victory over their rivals in the Bundesliga.',
    content: 'Bayern Munich put on a dominant display against Borussia Dortmund...',
    url: 'https://example.com/bayern-dortmund',
    urlToImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: { id: 'sky-sports', name: 'Sky Sports' },
    league: 'bundesliga',
    category: 'match-result'
  },
  {
    id: '5',
    title: 'PSG and Mbappe agree on contract extension',
    description: 'Kylian Mbappe has agreed to extend his contract with Paris Saint-Germain until 2026.',
    content: 'Paris Saint-Germain have announced that Kylian Mbappe...',
    url: 'https://example.com/mbappe-contract',
    urlToImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    source: { id: 'lequipe', name: 'L\'Équipe' },
    league: 'ligue-1',
    category: 'transfer'
  },
  {
    id: '6',
    title: 'Inter Milan secures Serie A title with victory over Juventus',
    description: 'Inter Milan clinched their second consecutive Serie A title with a decisive win.',
    content: 'Inter Milan have secured the Serie A title after defeating Juventus...',
    url: 'https://example.com/inter-serie-a',
    urlToImage: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: { id: 'gazzetta', name: 'Gazzetta dello Sport' },
    league: 'serie-a',
    category: 'match-result'
  },
  {
    id: '7',
    title: 'World Cup 2026: Venues announced for USA, Canada, and Mexico',
    description: 'FIFA has announced the official venues for the 2026 World Cup across three countries.',
    content: 'FIFA has officially announced the venues for the 2026 World Cup...',
    url: 'https://example.com/world-cup-venues',
    urlToImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    source: { id: 'fifa', name: 'FIFA' },
    league: 'world-cup',
    category: 'tournament'
  },
  {
    id: '8',
    title: 'Europa League: Manchester United advances to quarterfinals',
    description: 'Manchester United secured their place in the Europa League quarterfinals with a 2-1 aggregate win.',
    content: 'Manchester United have advanced to the Europa League quarterfinals...',
    url: 'https://example.com/united-europa',
    urlToImage: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=250&fit=crop',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: { id: 'uefa', name: 'UEFA' },
    league: 'europa-league',
    category: 'match-result'
  }
]

export class NewsService {
  private static instance: NewsService
  private newsCache: NewsArticle[] = MOCK_NEWS_DATA

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService()
    }
    return NewsService.instance
  }

  async getNews(filters?: NewsFilters): Promise<NewsArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredNews = [...this.newsCache]

    if (filters?.league) {
      filteredNews = filteredNews.filter(article => article.league === filters.league)
    }

    if (filters?.category) {
      filteredNews = filteredNews.filter(article => article.category === filters.category)
    }

    if (filters?.dateRange) {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filteredNews = filteredNews.filter(article => 
        new Date(article.publishedAt) >= cutoffDate
      )
    }

    // Sort by published date (newest first)
    filteredNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    return filteredNews
  }

  async getTopNews(limit: number = 5): Promise<NewsArticle[]> {
    const news = await this.getNews()
    return news.slice(0, limit)
  }

  async getNewsByLeague(league: string): Promise<NewsArticle[]> {
    return this.getNews({ league })
  }
}

export const newsService = NewsService.getInstance()