"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Users, 
  Crown,
  MapPin,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react"

interface LeagueInfo {
  id: string
  name: string
  description: string | null
  competition: {
    name: string
    shortName: string
  }
  creator: {
    displayName: string | null
    email: string
  }
  currentMembers: number
  maxMembers: number
  status: string
  leagueType: string
}

export default function JoinLeaguePage() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.leagueId as string
  
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (leagueId) {
      fetchLeagueInfo()
    }
  }, [leagueId])

  const fetchLeagueInfo = async () => {
    try {
      const response = await fetch(`/api/leagues/${leagueId}/invite`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch league information')
      }
      
      const data = await response.json()
      setLeagueInfo(data)
    } catch (error) {
      console.error('Error fetching league info:', error)
      setError(error instanceof Error ? error.message : 'Failed to load league information')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinLeague = async () => {
    setJoining(true)
    setError("")

    try {
      const response = await fetch(`/api/leagues/${leagueId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to join league')
      }

      setSuccess(true)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Error joining league:', error)
      setError(error instanceof Error ? error.message : 'Failed to join league')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading league information...</p>
        </div>
      </div>
    )
  }

  if (error && !leagueInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">
              Unable to Load League
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
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl text-green-600 dark:text-green-400">
              Welcome to the League!
            </CardTitle>
            <CardDescription>
              You've successfully joined {leagueInfo?.name}. Redirecting you to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              You're Invited!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Join this fantasy football league and compete with friends.
            </p>
          </div>

          {/* League Information */}
          {leagueInfo && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                      {leagueInfo.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {leagueInfo.description || "Join this exciting fantasy football league!"}
                    </CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    leagueInfo.leagueType === 'PRIVATE' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {leagueInfo.leagueType === 'PRIVATE' ? 'Private League' : 'Public League'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{leagueInfo.competition.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Competition</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">{leagueInfo.currentMembers}/{leagueInfo.maxMembers} Members</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">League Size</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{leagueInfo.creator.displayName || leagueInfo.creator.email.split('@')[0]}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">League Creator</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium capitalize">{leagueInfo.status.toLowerCase()}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>League Capacity</span>
                    <span>{leagueInfo.currentMembers}/{leagueInfo.maxMembers}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(leagueInfo.currentMembers / leagueInfo.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleJoinLeague}
              disabled={joining}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg"
            >
              {joining ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Joining League...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Join League
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Information Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              By joining this league, you agree to participate in good faith and follow the league rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}