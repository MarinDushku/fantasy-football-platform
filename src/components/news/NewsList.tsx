'use client'

import React, { useState, useEffect } from 'react'
import { NewsCard } from './NewsCard'
import { NewsFilters } from './NewsFilters'
import { newsService, NewsArticle, NewsFilters as NewsFiltersType } from '@/lib/newsApi'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, RefreshCw, Newspaper, TrendingUp } from 'lucide-react'

interface NewsListProps {
  showFilters?: boolean
  maxItems?: number
  variant?: 'default' | 'compact' | 'featured'
  title?: string
}

export const NewsList: React.FC<NewsListProps> = ({ 
  showFilters = true, 
  maxItems,
  variant = 'default',
  title = 'Latest Football News'
}) => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<NewsFiltersType>({})
  const [refreshing, setRefreshing] = useState(false)

  const loadNews = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const articles = await newsService.getNews(filters)
      const limitedArticles = maxItems ? articles.slice(0, maxItems) : articles
      setNews(limitedArticles)
    } catch (error) {
      console.error('Failed to load news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadNews(true)
  }

  useEffect(() => {
    loadNews()
  }, [filters, maxItems])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading news...</span>
      </div>
    )
  }

  const displayedNews = news
  const hasNews = displayedNews.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          {hasNews && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{displayedNews.length} articles</span>
            </div>
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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <NewsFilters
                filters={filters}
                onFiltersChange={setFilters}
                newsCount={displayedNews.length}
              />
            </Card>
          </div>
        )}

        {/* News Content */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {!hasNews ? (
            <Card className="p-8 text-center">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No news found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or check back later for new articles.
              </p>
              <Button onClick={() => setFilters({})} variant="outline">
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {variant === 'featured' && displayedNews.length > 0 && (
                <div className="mb-6">
                  <NewsCard article={displayedNews[0]} variant="featured" />
                </div>
              )}
              
              <div className={
                variant === 'compact' 
                  ? 'grid gap-3' 
                  : variant === 'featured' 
                    ? 'grid md:grid-cols-2 gap-4'
                    : 'grid gap-4'
              }>
                {(variant === 'featured' ? displayedNews.slice(1) : displayedNews).map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    variant={variant}
                  />
                ))}
              </div>

              {/* Load More Button (if not showing all news) */}
              {maxItems && news.length > maxItems && (
                <div className="text-center pt-6">
                  <Button variant="outline" onClick={() => loadNews()}>
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}