'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Heart, ArrowRight, ArrowLeft } from 'lucide-react'
import { LEAGUES, TEAMS_DATA, getTeamsByLeague, TeamData } from '@/lib/teamsData'

interface TeamSelectorProps {
  onComplete: (selectedTeams: string[]) => void
  onBack?: () => void
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ onComplete, onBack }) => {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [step, setStep] = useState<'leagues' | 'teams'>('leagues')

  const handleLeagueSelect = (leagueId: string) => {
    setSelectedLeague(leagueId)
    setStep('teams')
  }

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  const handleBackToLeagues = () => {
    setStep('leagues')
    setSelectedLeague(null)
  }

  const handleComplete = () => {
    onComplete(selectedTeams)
  }

  const currentLeagueTeams = selectedLeague ? getTeamsByLeague(selectedLeague) : []
  const leagues = Object.values(LEAGUES)

  if (step === 'leagues') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Leagues</h2>
          <p className="text-lg text-gray-600">
            Select the leagues you want to follow for personalized news and updates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {leagues.map((league) => (
            <Card 
              key={league.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200"
              onClick={() => handleLeagueSelect(league.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">{league.emoji}</div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {league.name}
                </CardTitle>
                <p className="text-gray-500">{league.country}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Select Teams</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          {selectedTeams.length > 0 && (
            <Button onClick={handleComplete} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Continue with {selectedTeams.length} teams
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const selectedLeagueInfo = leagues.find(l => l.id === selectedLeague)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToLeagues}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leagues
          </Button>
          <div className="text-4xl mr-4">{selectedLeagueInfo?.emoji}</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{selectedLeagueInfo?.name}</h2>
            <p className="text-gray-600">Select your favorite teams</p>
          </div>
        </div>
        
        {selectedTeams.length > 0 && (
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <Heart className="w-4 h-4 mr-2" />
            {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {currentLeagueTeams.map((team) => {
          const isSelected = selectedTeams.includes(team.id)
          
          return (
            <Card 
              key={team.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleTeamToggle(team.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={team.logoUrl} 
                      alt={team.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm group-hover:text-blue-600 transition-colors ${
                      isSelected ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {team.name}
                    </h3>
                    <p className="text-xs text-gray-500">{team.shortName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {currentLeagueTeams.length} teams available
          </Badge>
          {selectedTeams.length > 0 && (
            <Badge className="bg-blue-100 text-blue-800">
              {selectedTeams.length} selected
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTeams([])}
            disabled={selectedTeams.length === 0}
          >
            Clear Selection
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={selectedTeams.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Continue with {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}