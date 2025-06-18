'use client'

import React, { useState, useEffect } from 'react'
import { NewsCard } from './NewsCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw, Newspaper, TrendingUp, Heart, Settings, Star } from 'lucide-react'
import { NewsArticle } from '@/lib/newsApi'
import Link from 'next/link'

interface PersonalizationInfo {
  favoriteTeamsCount: number
  favoriteTeams: Array<{
    id: string
    name: string
    shortName: string
    league: string
  }>
  totalAvailable: number
  isPersonalized: boolean
}

interface PersonalizedNewsResponse {
  news: NewsArticle[]
  personalization: PersonalizationInfo
}

interface PersonalizedNewsListProps {
  maxItems?: number
  variant?: 'default' | 'compact' | 'featured'
  title?: string
}

export const PersonalizedNewsList: React.FC<PersonalizedNewsListProps> = ({ 
  maxItems = 10,
  variant = 'default',
  title = 'Your Personalized News'
}) => {
  const [newsData, setNewsData] = useState<PersonalizedNewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPersonalizedNews = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    setError(null)
    
    try {
      const response = await fetch(`/api/news/personalized?limit=${maxItems}`)
      
      if (response.status === 403) {
        const data = await response.json()
        if (data.redirectTo === '/onboarding') {
          window.location.href = '/onboarding'
          return
        }
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch personalized news')
      }

      const data: PersonalizedNewsResponse = await response.json()
      setNewsData(data)
    } catch (error) {
      console.error('Failed to load personalized news:', error)
      setError('Failed to load personalized news. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadPersonalizedNews(true)
  }

  useEffect(() => {
    loadPersonalizedNews()
  }, [maxItems])

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading your personalized news...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
        <CardContent className="p-8 text-center">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Unable to load news</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => loadPersonalizedNews()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!newsData) {
    return null
  }

  const { news, personalization } = newsData
  const hasNews = news.length > 0

  return (
    <div className="space-y-6">
      {/* Header with personalization info */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
              </div>
              {hasNews && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {news.length} articles
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
          
          {personalization.isPersonalized ? (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Personalized for your {personalization.favoriteTeamsCount} favorite teams</span>
              <div className="flex items-center space-x-2">
                {personalization.favoriteTeams.slice(0, 3).map((team, index) => (
                  <Badge key={team.id} variant="outline" className="text-xs">
                    {team.shortName}
                  </Badge>
                ))}
                {personalization.favoriteTeams.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{personalization.favoriteTeams.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>General football news - set up your preferences for personalized content</span>
              <Link href="/onboarding">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Settings className="w-4 h-4 mr-1" />
                  Personalize
                </Button>
              </Link>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* News Content */}
      {!hasNews ? (
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
          <CardContent className="p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No personalized news found</h3>
            <p className="text-gray-500 mb-4">
              {personalization.isPersonalized 
                ? "No recent news about your favorite teams. Check back later!"
                : "Set up your team preferences to see personalized news here."
              }
            </p>
            {!personalization.isPersonalized && (
              <Link href="/onboarding">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Star className="w-4 h-4 mr-2" />
                  Choose Your Teams
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {variant === 'featured' && news.length > 0 && (
            <div className="mb-6">
              <NewsCard article={news[0]} variant="featured" />
            </div>
          )}
          
          <div className={
            variant === 'compact' 
              ? 'grid gap-3' 
              : variant === 'featured' 
                ? 'grid md:grid-cols-2 gap-4'
                : 'grid gap-4'
          }>
            {(variant === 'featured' ? news.slice(1) : news).map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                variant={variant}
              />
            ))}
          </div>

          {/* Personalization tip */}
          {personalization.isPersonalized && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      <strong>Personalized for you:</strong> We found {personalization.totalAvailable} articles 
                      related to your favorite teams out of all available news.
                    </p>
                  </div>
                  <Link href="/settings/preferences">
                    <Button variant="ghost" size="sm" className="text-blue-600 text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Edit Teams
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}