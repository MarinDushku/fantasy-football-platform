"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search,
  Crown,
  MapPin,
  Link,
  Loader2,
  Trophy,
  UserPlus,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react"

interface JoinLeagueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeagueJoined: () => void
}

interface PublicLeague {
  id: string
  name: string
  description: string | null
  currentMembers: number
  maxMembers: number
  competition: {
    name: string
    shortName: string
  }
  creator: {
    displayName: string | null
    email: string
  }
  status: string
  leagueType: string
}

export function JoinLeagueModal({ open, onOpenChange, onLeagueJoined }: JoinLeagueModalProps) {
  const [inviteCode, setInviteCode] = useState("")
  const [publicLeagues, setPublicLeagues] = useState<PublicLeague[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [joining, setJoining] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (open) {
      fetchPublicLeagues()
    }
  }, [open])

  const fetchPublicLeagues = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/leagues/public')
      if (response.ok) {
        const data = await response.json()
        setPublicLeagues(data)
      }
    } catch (error) {
      console.error('Error fetching public leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) return
    
    setSearching(true)
    setError("")
    setSuccess("")

    try {
      // Try to extract league ID from invitation link or use as direct code
      const leagueId = inviteCode.includes('/join') 
        ? inviteCode.split('/').slice(-2, -1)[0] // Extract league ID from URL
        : inviteCode.trim()

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

      setSuccess('Successfully joined the league!')
      onLeagueJoined()
      
      // Close modal after short delay
      setTimeout(() => {
        onOpenChange(false)
        setInviteCode("")
        setSuccess("")
      }, 2000)

    } catch (error) {
      console.error('Error joining league:', error)
      setError(error instanceof Error ? error.message : 'Failed to join league')
    } finally {
      setSearching(false)
    }
  }

  const handleJoinPublicLeague = async (leagueId: string) => {
    setJoining(leagueId)
    setError("")
    setSuccess("")

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

      setSuccess('Successfully joined the league!')
      onLeagueJoined()
      
      // Close modal after short delay
      setTimeout(() => {
        onOpenChange(false)
        setSuccess("")
      }, 2000)

    } catch (error) {
      console.error('Error joining league:', error)
      setError(error instanceof Error ? error.message : 'Failed to join league')
    } finally {
      setJoining(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <UserPlus className="w-6 h-6 mr-2 text-blue-500" />
            Join a League
          </DialogTitle>
          <DialogDescription>
            Join an existing league by invitation code or browse public leagues.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Join by Invitation Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Link className="w-5 h-5 mr-2 text-purple-500" />
                Join by Invitation
              </CardTitle>
              <CardDescription>
                Enter an invitation code or paste an invitation link to join a specific league.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinByCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invitation Code or Link</Label>
                  <Input
                    id="inviteCode"
                    placeholder="Enter invitation code or paste invitation link..."
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={searching}
                  />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    You can paste either the full invitation link or just the league code.
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={searching || !inviteCode.trim()}
                  className="w-full"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Join League
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Browse Public Leagues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Public Leagues
                </CardTitle>
                <CardDescription>
                  Browse and join public leagues that are open to everyone.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPublicLeagues}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <span className="text-slate-600 dark:text-slate-400">Loading public leagues...</span>
                </div>
              ) : publicLeagues.length > 0 ? (
                <div className="space-y-3">
                  {publicLeagues.map((league) => (
                    <div key={league.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {league.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {league.leagueType}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {league.description || "Join this exciting fantasy football league!"}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {league.competition.name}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {league.currentMembers}/{league.maxMembers} members
                              </div>
                              <div className="flex items-center">
                                <Crown className="w-3 h-3 mr-1" />
                                {league.creator.displayName || league.creator.email.split('@')[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleJoinPublicLeague(league.id)}
                          disabled={joining === league.id || league.currentMembers >= league.maxMembers}
                          className="ml-4"
                        >
                          {joining === league.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : league.currentMembers >= league.maxMembers ? (
                            'Full'
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Join
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No public leagues available
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    There are currently no public leagues accepting new members.
                  </p>
                  <Button onClick={fetchPublicLeagues} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}