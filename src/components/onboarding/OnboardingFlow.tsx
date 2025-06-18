'use client'

import React, { useState } from 'react'
import { TeamSelector } from './TeamSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Trophy, Newspaper, Bell, Star } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: (preferences: UserOnboardingData) => void
}

export interface UserOnboardingData {
  selectedTeams: string[]
  newsFrequency: 'instant' | 'daily' | 'weekly'
  notificationsEnabled: boolean
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [newsFrequency, setNewsFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const steps = ['welcome', 'teams', 'preferences', 'complete']

  const handleTeamsComplete = (teams: string[]) => {
    setSelectedTeams(teams)
    setCurrentStep(2) // Go to preferences
  }

  const handlePreferencesComplete = () => {
    setCurrentStep(3) // Go to complete
  }

  const handleFinalComplete = () => {
    onComplete({
      selectedTeams,
      newsFrequency,
      notificationsEnabled
    })
  }

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to FantasyHub!
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Let's personalize your experience by setting up your favorite teams and news preferences. 
              This will help us show you the most relevant content.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose Teams</h3>
                <p className="text-sm text-gray-600">Select your favorite teams from top leagues</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Newspaper className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Personalized News</h3>
                <p className="text-sm text-gray-600">Get news tailored to your interests</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Notifications</h3>
                <p className="text-sm text-gray-600">Stay updated with what matters most</p>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={() => setCurrentStep(1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-3"
            >
              Let's Get Started!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <TeamSelector 
          onComplete={handleTeamsComplete}
          onBack={() => setCurrentStep(0)}
        />
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
              <p className="text-lg text-gray-600">
                Customize how you want to receive updates about your teams
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How often would you like to receive news?
                </label>
                <div className="grid gap-3">
                  {[
                    { value: 'instant', label: 'Instant', description: 'Get news as it happens' },
                    { value: 'daily', label: 'Daily Digest', description: 'Once per day summary' },
                    { value: 'weekly', label: 'Weekly Summary', description: 'Weekly roundup' }
                  ].map((option) => (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        newsFrequency === option.value 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setNewsFrequency(option.value as any)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{option.label}</h3>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                          {newsFrequency === option.value && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Card 
                  className={`cursor-pointer transition-all ${
                    notificationsEnabled 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Enable Push Notifications</h3>
                        <p className="text-sm text-gray-600">Get notified about breaking news and match updates</p>
                      </div>
                      {notificationsEnabled && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back to Teams
              </Button>
              <Button 
                onClick={handlePreferencesComplete}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Almost Done!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              You're All Set! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your personalized fantasy football experience is ready. You'll now see news and updates 
              from your {selectedTeams.length} favorite team{selectedTeams.length !== 1 ? 's' : ''}.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Your Preferences:</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>📺 <strong>{selectedTeams.length}</strong> favorite teams selected</p>
                <p>📰 News frequency: <strong>{newsFrequency}</strong></p>
                <p>🔔 Notifications: <strong>{notificationsEnabled ? 'Enabled' : 'Disabled'}</strong></p>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={handleFinalComplete}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-lg px-8 py-3"
            >
              Enter FantasyHub Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}