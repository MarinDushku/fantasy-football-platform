'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FOOTBALL_LEAGUES, NewsFilters as NewsFiltersType } from '@/lib/newsApi'
import { Filter, Calendar, Trophy, X } from 'lucide-react'

interface NewsFiltersProps {
  filters: NewsFiltersType
  onFiltersChange: (filters: NewsFiltersType) => void
  newsCount?: number
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  newsCount = 0 
}) => {
  const leagues = Object.entries(FOOTBALL_LEAGUES)
  const categories = [
    { id: 'match-result', name: 'Match Results', icon: '⚽' },
    { id: 'transfer', name: 'Transfers', icon: '🔄' },
    { id: 'tournament', name: 'Tournaments', icon: '🏆' },
    { id: 'injury', name: 'Injuries', icon: '🏥' },
    { id: 'analysis', name: 'Analysis', icon: '📊' },
  ]

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
  ]

  const handleLeagueFilter = (leagueId: string) => {
    onFiltersChange({
      ...filters,
      league: filters.league === leagueId ? undefined : leagueId
    })
  }

  const handleCategoryFilter = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId
    })
  }

  const handleDateRangeFilter = (dateRange: 'today' | 'week' | 'month') => {
    onFiltersChange({
      ...filters,
      dateRange: filters.dateRange === dateRange ? undefined : dateRange
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = [filters.league, filters.category, filters.dateRange].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {newsCount} {newsCount === 1 ? 'article' : 'articles'}
      </div>

      {/* League Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Leagues & Competitions</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {leagues.map(([leagueId, league]) => (
            <Button
              key={leagueId}
              variant={filters.league === leagueId ? "default" : "outline"}
              size="sm"
              onClick={() => handleLeagueFilter(leagueId)}
              className="justify-start text-left h-auto py-2 px-3"
            >
              <span className="mr-2">{league.emoji}</span>
              <span className="text-xs">{league.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Categories</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filters.category === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category.id)}
              className="justify-start text-left h-auto py-2 px-3"
            >
              <span className="mr-2">{category.icon}</span>
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Time Period</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {dateRanges.map((range) => (
            <Button
              key={range.id}
              variant={filters.dateRange === range.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateRangeFilter(range.id as 'today' | 'week' | 'month')}
              className="justify-start text-left h-auto py-2 px-3"
            >
              <span className="text-xs">{range.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-900">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.league && (
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleLeagueFilter(filters.league!)}
              >
                {FOOTBALL_LEAGUES[filters.league as keyof typeof FOOTBALL_LEAGUES].emoji}
                {FOOTBALL_LEAGUES[filters.league as keyof typeof FOOTBALL_LEAGUES].name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {filters.category && (
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleCategoryFilter(filters.category!)}
              >
                {categories.find(c => c.id === filters.category)?.name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {filters.dateRange && (
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleDateRangeFilter(filters.dateRange!)}
              >
                {dateRanges.find(d => d.id === filters.dateRange)?.name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}