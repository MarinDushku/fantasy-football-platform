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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Trophy, 
  Users, 
  Target, 
  DollarSign,
  Settings,
  Crown,
  Zap,
  Calendar,
  MapPin,
  Loader2
} from "lucide-react"

interface CreateLeagueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeagueCreated: () => void
}

interface Competition {
  id: string
  name: string
  shortName: string
  country: string
}

export function CreateLeagueModal({ open, onOpenChange, onLeagueCreated }: CreateLeagueModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    competitionId: "",
    leagueType: "PRIVATE",
    maxMembers: "12",
    entryFee: "0",
    selectionMethod: "AUCTION",
    budgetLimit: "100000000",
    squadSize: "15",
    hasPlayoffs: true
  })
  
  const [competitions, setCompetitions] = useState<Competition[]>([
    { id: "premier-league", name: "Premier League", shortName: "PL", country: "England" },
    { id: "la-liga", name: "La Liga", shortName: "LL", country: "Spain" },
    { id: "serie-a", name: "Serie A", shortName: "SA", country: "Italy" },
    { id: "bundesliga", name: "Bundesliga", shortName: "BL", country: "Germany" },
    { id: "ligue-1", name: "Ligue 1", shortName: "L1", country: "France" }
  ])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxMembers: parseInt(formData.maxMembers),
          entryFee: parseFloat(formData.entryFee),
          budgetLimit: parseInt(formData.budgetLimit),
          squadSize: parseInt(formData.squadSize)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create league')
      }

      const league = await response.json()
      console.log('League created:', league)
      
      onLeagueCreated()
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        competitionId: "",
        leagueType: "PRIVATE",
        maxMembers: "12",
        entryFee: "0",
        selectionMethod: "AUCTION",
        budgetLimit: "100000000",
        squadSize: "15",
        hasPlayoffs: true
      })
    } catch (error) {
      console.error('Error creating league:', error)
      setError(error instanceof Error ? error.message : 'Failed to create league')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Crown className="w-6 h-6 mr-2 text-yellow-500" />
            Create New League
          </DialogTitle>
          <DialogDescription>
            Set up your fantasy football league and invite your friends to compete.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-blue-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">League Name *</Label>
                  <Input
                    id="name"
                    placeholder="Premier Champions League"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competition">Competition *</Label>
                  <Select value={formData.competitionId} onValueChange={(value) => handleChange("competitionId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competition" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitions.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {comp.name} ({comp.country})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A competitive league for serious fantasy managers..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* League Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-green-500" />
                League Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leagueType">League Type</Label>
                  <Select value={formData.leagueType} onValueChange={(value) => handleChange("leagueType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Private (Invite Only)
                        </div>
                      </SelectItem>
                      <SelectItem value="PUBLIC">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Public (Anyone can join)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Max Members</Label>
                  <Select value={formData.maxMembers} onValueChange={(value) => handleChange("maxMembers", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 6, 8, 10, 12, 14, 16, 20].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} managers
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryFee">Entry Fee ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.entryFee}
                    onChange={(e) => handleChange("entryFee", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Squad & Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                Squad & Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selectionMethod">Selection Method</Label>
                  <Select value={formData.selectionMethod} onValueChange={(value) => handleChange("selectionMethod", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUCTION">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Auction Draft
                        </div>
                      </SelectItem>
                      <SelectItem value="DRAFT">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Snake Draft
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="squadSize">Squad Size</Label>
                  <Select value={formData.squadSize} onValueChange={(value) => handleChange("squadSize", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[11, 13, 15, 17, 20].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} players
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetLimit">Budget (€)</Label>
                  <Select value={formData.budgetLimit} onValueChange={(value) => handleChange("budgetLimit", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50000000">€50M</SelectItem>
                      <SelectItem value="75000000">€75M</SelectItem>
                      <SelectItem value="100000000">€100M</SelectItem>
                      <SelectItem value="125000000">€125M</SelectItem>
                      <SelectItem value="150000000">€150M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasPlayoffs"
                  checked={formData.hasPlayoffs}
                  onChange={(e) => handleChange("hasPlayoffs", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasPlayoffs" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Enable playoffs at end of season
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading || !formData.name || !formData.competitionId}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Create League
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}