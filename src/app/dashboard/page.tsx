import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PersonalizedNewsList } from "@/components/news/PersonalizedNewsList"
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
  Activity
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, Manager!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Your fantasy empire awaits. Ready to dominate this week?
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create League
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </p>
                    <p className={`text-sm flex items-center mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.gradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <CardDescription>Manage your fantasy kingdoms</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockLeagues.map((league, index) => (
                <div key={index} className="group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${league.gradient}`}>
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {league.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {league.position} • {league.members} members
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {league.points}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        points
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  )
}

const quickStats = [
  {
    label: "Total Points",
    value: "1,847",
    change: "+12% from last week",
    trend: "up",
    icon: Trophy,
    gradient: "bg-gradient-to-br from-yellow-400 to-orange-500"
  },
  {
    label: "Global Rank",
    value: "#2,456",
    change: "+234 positions",
    trend: "up",
    icon: TrendingUp,
    gradient: "bg-gradient-to-br from-green-400 to-blue-500"
  },
  {
    label: "Active Leagues",
    value: "3",
    change: "1st in 2 leagues",
    trend: "up",
    icon: Users,
    gradient: "bg-gradient-to-br from-blue-400 to-purple-500"
  },
  {
    label: "This Gameweek",
    value: "87",
    change: "+23 from average",
    trend: "up",
    icon: Star,
    gradient: "bg-gradient-to-br from-purple-400 to-pink-500"
  }
]

const mockLeagues = [
  {
    name: "Premier Division Elite",
    position: "1st place",
    members: "12",
    points: "1,847",
    gradient: "bg-gradient-to-br from-yellow-400 to-orange-500"
  },
  {
    name: "Champions League",
    position: "3rd place", 
    members: "8",
    points: "1,645",
    gradient: "bg-gradient-to-br from-blue-400 to-purple-500"
  },
  {
    name: "Weekend Warriors",
    position: "1st place",
    members: "10", 
    points: "1,923",
    gradient: "bg-gradient-to-br from-green-400 to-blue-500"
  }
]

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