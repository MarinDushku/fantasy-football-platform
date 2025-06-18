"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PersonalizedNewsList } from "@/components/news/PersonalizedNewsList"
import { CreateLeagueModal } from "@/components/leagues/CreateLeagueModal"
import { InviteToLeagueModal } from "@/components/leagues/InviteToLeagueModal"
import { JoinLeagueModal } from "@/components/leagues/JoinLeagueModal"
import { 
  Trophy, 
  Users, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  ArrowRight,
  Zap,
  Crown,
  Activity,
  UserPlus,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Medal,
  Calendar
} from "lucide-react"

interface UserData {
  id: string
  email: string
  displayName: string | null
  totalExperiencePoints: number
  reputationScore: number
  isPremium: boolean
  createdAt: string
  _count: {
    createdLeagues: number
    leagueMemberships: number
  }
}

interface League {
  id: string
  name: string
  currentMembers: number
  maxMembers: number
  status: string
  competition: {
    name: string
    shortName: string
  }
  memberships: Array<{
    teamName: string
    totalPoints: number
    leaguePosition: number | null
  }>
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateLeague, setShowCreateLeague] = useState(false)
  const [showJoinLeague, setShowJoinLeague] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserData()
    fetchLeagues()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues')
      if (response.ok) {
        const data = await response.json()
        setLeagues(data)
      }
    } catch (error) {
      console.error('Error fetching leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalPoints = () => {
    return leagues.reduce((total, league) => {
      const userMembership = league.memberships.find(m => m.teamName)
      return total + (userMembership?.totalPoints || 0)
    }, 0)
  }

  const getBestPosition = () => {
    const positions = leagues
      .map(league => league.memberships.find(m => m.teamName)?.leaguePosition)
      .filter(pos => pos !== null && pos !== undefined) as number[]
    
    return positions.length > 0 ? Math.min(...positions) : null
  }

  const getDisplayName = () => {
    return userData?.displayName || userData?.email?.split('@')[0] || 'Manager'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const totalPoints = getTotalPoints()
  const bestPosition = getBestPosition()
  const hasNoLeagues = leagues.length === 0
  const hasNoPoints = totalPoints === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {getDisplayName()}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                {hasNoLeagues 
                  ? "Ready to start your fantasy football journey?" 
                  : "Your fantasy empire awaits. Ready to dominate this week?"
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowJoinLeague(true)}
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Join League
              </Button>
              <Button 
                onClick={() => setShowCreateLeague(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create League
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Total Points
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalPoints.toLocaleString()}
                  </p>
                  {hasNoPoints && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-2">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Join a league to start scoring!
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Best Position
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {bestPosition ? `#${bestPosition}` : 'N/A'}
                  </p>
                  {bestPosition === 1 && (
                    <p className="text-xs text-green-600 flex items-center mt-2">
                      <Crown className="w-3 h-3 mr-1" />
                      League leader!
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                  <Medal className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Active Leagues
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {leagues.length}
                  </p>
                  {hasNoLeagues && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Create your first league!
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Experience
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {userData?.totalExperiencePoints || 0}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    XP points earned
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Leagues */}
          <Card className="lg:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  My Leagues
                </CardTitle>
                <CardDescription>
                  {hasNoLeagues ? "Get started by creating or joining a league" : "Manage your fantasy kingdoms"}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowJoinLeague(true)}
                  variant="outline" 
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join League
                </Button>
                {leagues.length > 3 && (
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasNoLeagues ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No leagues yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Start your fantasy football journey by creating a league with friends or joining an existing one.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setShowCreateLeague(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create League
                    </Button>
                    <Button 
                      onClick={() => setShowJoinLeague(true)}
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join League
                    </Button>
                  </div>
                </div>
              ) : (
                leagues.slice(0, 3).map((league, index) => {
                  const userMembership = league.memberships[0] // Assuming first membership is user's
                  return (
                    <div 
                      key={league.id} 
                      className="group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/leagues/${league.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {league.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {userMembership?.leaguePosition ? `#${userMembership.leaguePosition}` : 'Unranked'} • {league.currentMembers}/{league.maxMembers} members • {league.competition.shortName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {userMembership?.totalPoints || 0}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            points
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLeagueId(league.id)
                              setShowInviteModal(true)
                            }}
                            className="mt-2"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Invite
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Live Scores */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Live Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium text-sm">{match.teams}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{match.time}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {match.score}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hasNoLeagues ? (
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm font-medium mb-1">Getting Started</p>
                      <p className="text-xs opacity-90">
                        Create your first league to unlock personalized AI insights and transfer tips!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-sm font-medium mb-1">Transfer Tip</p>
                        <p className="text-xs opacity-90">
                          Consider transferring out Kane - 78% injury risk this week
                        </p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-sm font-medium mb-1">Captain Pick</p>
                        <p className="text-xs opacity-90">
                          Haaland has 89% chance of scoring vs Brighton
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Personalized Football News Section */}
        <PersonalizedNewsList 
          maxItems={5}
          variant="compact"
          title="Your Football News"
        />

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actionCards.map((card, index) => (
            <Card key={index} className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button variant="ghost" className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 w-full justify-between">
                  {card.action}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateLeagueModal 
        open={showCreateLeague} 
        onOpenChange={setShowCreateLeague}
        onLeagueCreated={fetchLeagues}
      />
      
      <JoinLeagueModal 
        open={showJoinLeague} 
        onOpenChange={setShowJoinLeague}
        onLeagueJoined={fetchLeagues}
      />
      
      {selectedLeagueId && (
        <InviteToLeagueModal 
          open={showInviteModal} 
          onOpenChange={setShowInviteModal}
          leagueId={selectedLeagueId}
        />
      )}
    </div>
  )
}

const mockMatches = [
  { teams: "MCI vs ARS", score: "2-1", time: "67'" },
  { teams: "LIV vs CHE", score: "1-0", time: "89'" },
  { teams: "MUN vs TOT", score: "0-0", time: "34'" }
]

const actionCards = [
  {
    title: "Player Search",
    description: "Find and analyze players with advanced filters and AI-powered insights.",
    action: "Search Players",
    icon: Target,
    gradient: "bg-gradient-to-br from-red-400 to-pink-500"
  },
  {
    title: "Draft Room",
    description: "Join live drafts with real-time analytics and auto-pick assistance.",
    action: "Join Draft",
    icon: Clock,
    gradient: "bg-gradient-to-br from-green-400 to-blue-500"
  },
  {
    title: "Analytics Hub",
    description: "Deep dive into performance analytics and prediction models.",
    action: "View Analytics",
    icon: BarChart3,
    gradient: "bg-gradient-to-br from-purple-400 to-indigo-500"
  }
]