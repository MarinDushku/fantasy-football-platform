'use client'

import React from 'react'
import { OnboardingFlow, UserOnboardingData } from '@/components/onboarding/OnboardingFlow'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  const handleOnboardingComplete = async (preferences: UserOnboardingData) => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        // Redirect to dashboard after successful onboarding
        router.push('/dashboard')
      } else {
        console.error('Failed to save preferences')
        // You could show an error message here
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      // You could show an error message here
    }
  }

  return (
    <div>
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </div>
  )
}