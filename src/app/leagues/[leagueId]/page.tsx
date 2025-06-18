"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InviteToLeagueModal } from "@/components/leagues/InviteToLeagueModal"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Trophy, 
  Users, 
  Crown,
  MapPin,
  Calendar,
  Settings,
  UserPlus,
  Play,
  Loader2,
  ArrowLeft,
  DollarSign,
  Target,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Activity,
  Medal,
  User
} from "lucide-react"

interface LeagueDetails {
  id: string
  name: string
  description: string | null
  creatorId: string
  currentMembers: number
  maxMembers: number
  budgetLimit: string
  squadSize: number
  status: string
  leagueType: string
  selectionMethod: string
  hasPlayoffs: boolean
  createdAt: string
  competition: {
    id: string
    name: string
    shortName: string
    country: string
  }
  creator: {
    id: string
    displayName: string | null
    email: string
  }
  memberships: Array<{
    id: string
    userId: string
    teamName: string
    totalPoints: number
    gameweekPoints: number
    leaguePosition: number | null
    isAdmin: boolean
    joinedAt: string
    user: {
      id: string
      displayName: string | null
      email: string
      totalExperiencePoints: number
    }
  }>
  scoringRules?: {
    goalPoints: number
    assistPoints: number
    cleanSheetGkPoints: number
    yellowCardPoints: number
    redCardPoints: number
  }
}

interface CurrentUser {
  id: string
  email: string
  isLeagueAdmin: boolean
  isLeagueCreator: boolean
}

export default function LeagueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.leagueId as string
  
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetails | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingDraft, setStartingDraft] = useState(false)
  const [error, setError] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    if (leagueId) {
      fetchLeagueDetails()
    }
  }, [leagueId])

  const fetchLeagueDetails = async () => {
    try {
      const response = await fetch(`/api/leagues/${leagueId}/details`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch league details')
      }
      
      const data = await response.json()
      setLeagueDetails(data.league)
      setCurrentUser(data.currentUser)
    } catch (error) {
      console.error('Error fetching league details:', error)
      setError(error instanceof Error ? error.message : 'Failed to load league details')
    } finally {
      setLoading(false)
    }
  }

  const handleStartDraft = async () => {
    setStartingDraft(true)
    setError("")

    try {
      const response = await fetch(`/api/leagues/${leagueId}/start-draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start draft')
      }

      // Refresh league details to show updated status
      await fetchLeagueDetails()
      
      // Redirect to draft room (will implement later)
      // router.push(`/leagues/${leagueId}/draft`)

    } catch (error) {
      console.error('Error starting draft:', error)
      setError(error instanceof Error ? error.message : 'Failed to start draft')
    } finally {
      setStartingDraft(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Target },
      AUCTION: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: DollarSign },
      ACTIVE: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: Activity },
      COMPLETED: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: CheckCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const IconComponent = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getUserInitials = (user: any) => {
    const name = user.displayName || user.email
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading league details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">
              Error Loading League
            </CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!leagueDetails) {
    return null
  }

  const canStartDraft = currentUser?.isLeagueCreator && 
                       leagueDetails.status === 'DRAFT' && 
                       leagueDetails.currentMembers >= 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {leagueDetails.name}
                  </h1>
                  {getStatusBadge(leagueDetails.status)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  {leagueDetails.description || `${leagueDetails.competition.name} Fantasy League`}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {canStartDraft && (
                <Button 
                  onClick={handleStartDraft}
                  disabled={startingDraft}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {startingDraft ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Draft
                    </>
                  )}
                </Button>
              )}
              
              {currentUser?.isLeagueAdmin && (
                <Button 
                  variant="outline"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* League Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* League Info */}
          <Card className="lg:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                League Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{leagueDetails.competition.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Competition</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">{leagueDetails.currentMembers}/{leagueDetails.maxMembers} Members</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">League Size</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{leagueDetails.selectionMethod}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Selection Method</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">€{(parseInt(leagueDetails.budgetLimit) / 1000000).toFixed(0)}M</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Budget Limit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">{leagueDetails.squadSize} Players</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Squad Size</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">{leagueDetails.creator.displayName || leagueDetails.creator.email.split('@')[0]}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">League Creator</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>League Capacity</span>
                  <span>{leagueDetails.currentMembers}/{leagueDetails.maxMembers}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(leagueDetails.currentMembers / leagueDetails.maxMembers) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  League Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {leagueDetails.memberships.reduce((total, member) => total + member.totalPoints, 0)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Points Scored</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {new Date(leagueDetails.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">League Created</p>
                </div>
              </CardContent>
            </Card>

            {leagueDetails.status === 'DRAFT' && (
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Draft Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm opacity-90">
                      League is ready for {leagueDetails.selectionMethod.toLowerCase()}. 
                      {canStartDraft ? ' You can start the draft when ready.' : ' Waiting for league creator to start.'}
                    </p>
                    <div className="text-xs opacity-75">
                      <p>• Minimum 2 members required</p>
                      <p>• Current members: {leagueDetails.currentMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* League Members */}
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-500" />
                League Members
              </CardTitle>
              <CardDescription>
                {leagueDetails.currentMembers} of {leagueDetails.maxMembers} managers
              </CardDescription>
            </div>
            {currentUser?.isLeagueAdmin && leagueDetails.currentMembers < leagueDetails.maxMembers && (
              <Button 
                variant="outline"
                onClick={() => setShowInviteModal(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leagueDetails.memberships
                .sort((a, b) => (a.leaguePosition || 999) - (b.leaguePosition || 999))
                .map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      {member.leaguePosition && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {member.leaguePosition}
                        </div>
                      )}
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {getUserInitials(member.user)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {member.user.displayName || member.user.email.split('@')[0]}
                        </h3>
                        {member.isAdmin && (
                          <Badge variant="outline" className="text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {member.userId === leagueDetails.creatorId && (
                          <Badge variant="outline" className="text-xs">
                            <Medal className="w-3 h-3 mr-1" />
                            Creator
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {member.teamName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {member.totalPoints}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      points
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {member.user.totalExperiencePoints} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Modal */}
      <InviteToLeagueModal 
        open={showInviteModal} 
        onOpenChange={setShowInviteModal}
        leagueId={leagueId}
      />

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Settings className="w-6 h-6 mr-2 text-blue-500" />
              League Settings
            </DialogTitle>
            <DialogDescription>
              Manage your league configuration and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Settings</CardTitle>
                <CardDescription>League name, description, and visibility settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-400">League Name:</span>
                    <p className="font-semibold">{leagueDetails?.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-400">League Type:</span>
                    <p className="font-semibold">{leagueDetails?.leagueType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-400">Max Members:</span>
                    <p className="font-semibold">{leagueDetails?.maxMembers}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-400">Squad Size:</span>
                    <p className="font-semibold">{leagueDetails?.squadSize}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-400">Budget Limit:</span>
                    <p className="font-semibold">€{leagueDetails ? (parseInt(leagueDetails.budgetLimit) / 1000000).toFixed(0) : 0}M</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-400">Selection Method:</span>
                    <p className="font-semibold">{leagueDetails?.selectionMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-5 h-5 mr-2 inline" />
                  Coming Soon
                </CardTitle>
                <CardDescription>Advanced settings will be available in future updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>• Edit league name and description</p>
                  <p>• Modify scoring rules</p>
                  <p>• Transfer window settings</p>
                  <p>• Draft and auction configurations</p>
                  <p>• Member management tools</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowSettingsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}