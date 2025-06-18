"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { 
  UserPlus, 
  Link, 
  Copy,
  Mail,
  Share2,
  Check,
  ExternalLink,
  Users,
  Crown,
  Loader2
} from "lucide-react"

interface InviteToLeagueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leagueId: string
}

export function InviteToLeagueModal({ open, onOpenChange, leagueId }: InviteToLeagueModalProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [copiedLink, setCopiedLink] = useState(false)
  
  // Generate invitation link
  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/leagues/${leagueId}/join?invite=true`
    : ""

  const handleInviteByUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/leagues/${leagueId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          type: 'username'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send invitation')
      }

      setSuccess(`Invitation sent to ${username}!`)
      setUsername("")
    } catch (error) {
      console.error('Error sending invitation:', error)
      setError(error instanceof Error ? error.message : 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleInviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/leagues/${leagueId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          type: 'email'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send invitation')
      }

      setSuccess(`Invitation sent to ${email}!`)
      setEmail("")
    } catch (error) {
      console.error('Error sending invitation:', error)
      setError(error instanceof Error ? error.message : 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const shareInviteLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Fantasy Football League!',
          text: 'You\'ve been invited to join my fantasy football league. Click the link to join!',
          url: inviteLink,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyInviteLink()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <UserPlus className="w-6 h-6 mr-2 text-blue-500" />
            Invite Players
          </DialogTitle>
          <DialogDescription>
            Invite friends to join your league using their username, email, or share an invitation link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Invite by Username */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                Invite by Username
              </CardTitle>
              <CardDescription>
                Send an invitation to a user by their platform username.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteByUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !username.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Invite by Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="w-5 h-5 mr-2 text-green-500" />
                Invite by Email
              </CardTitle>
              <CardDescription>
                Send an email invitation to someone not yet on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteByEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !email.trim()}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email Invitation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Share Invite Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Link className="w-5 h-5 mr-2 text-blue-500" />
                Share Invite Link
              </CardTitle>
              <CardDescription>
                Share this link with anyone you want to invite to your league.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteLink">Invitation Link</Label>
                <div className="flex space-x-2">
                  <Input
                    id="inviteLink"
                    value={inviteLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyInviteLink}
                    className="shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={shareInviteLink}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(`mailto:?subject=Join my Fantasy Football League!&body=You've been invited to join my fantasy football league! Click this link to join: ${inviteLink}`, '_blank')}
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Link
                </Button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="space-y-1">
                  <li>• Anyone with this link can join your league</li>
                  <li>• The link expires when the league is full</li>
                  <li>• You can disable the link anytime in league settings</li>
                </ul>
              </div>
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
            <Button 
              type="button"
              onClick={() => window.open(`/leagues/${leagueId}`, '_blank')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View League
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}