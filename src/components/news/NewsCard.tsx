'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ExternalLink, Newspaper } from 'lucide-react'
import { NewsArticle, FOOTBALL_LEAGUES } from '@/lib/newsApi'

interface NewsCardProps {
  article: NewsArticle
  variant?: 'default' | 'compact' | 'featured'
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default' }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const league = article.league ? FOOTBALL_LEAGUES[article.league as keyof typeof FOOTBALL_LEAGUES] : null
  const isImageAvailable = article.urlToImage && article.urlToImage !== ''

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {isImageAvailable && (
              <img 
                src={article.urlToImage} 
                alt={article.title}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {league && (
                  <Badge variant="secondary" className="text-xs">
                    <span className="mr-1">{league.emoji}</span>
                    {league.name}
                  </Badge>
                )}
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeAgo(article.publishedAt)}
                </div>
              </div>
              <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {article.source.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        {isImageAvailable && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={article.urlToImage} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              {league && (
                <Badge className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-white">
                  <span className="mr-1">{league.emoji}</span>
                  {league.name}
                </Badge>
              )}
            </div>
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimeAgo(article.publishedAt)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Newspaper className="w-4 h-4 mr-1" />
              {article.source.name}
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
              <span>Read more</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {league && (
            <Badge variant="secondary" className={`text-xs ${league.color}`}>
              <span className="mr-1">{league.emoji}</span>
              {league.name}
            </Badge>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {formatTimeAgo(article.publishedAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Newspaper className="w-4 h-4 mr-1" />
                {article.source.name}
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>Read more</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
          {isImageAvailable && (
            <div className="w-32 h-24 flex-shrink-0">
              <img 
                src={article.urlToImage} 
                alt={article.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}