'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trophy, ArrowRight, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DevSignIn() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSignIn = async () => {
    if (!email) return

    try {
      // Create a development session
      const response = await fetch('/api/auth/dev-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || email.split('@')[0]
        }),
      })

      if (response.ok) {
        // Redirect to dashboard or onboarding
        router.push('/dashboard')
      } else {
        console.error('Failed to sign in')
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Development Sign In
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Quick sign in for development and testing
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Display Name (Optional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-4 pt-4">
            <Button
              onClick={handleSignIn}
              disabled={!email}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In to FantasyHub
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This is a development sign-in for testing purposes
              </p>
            </div>
          </div>

          {/* Quick Test Users */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Test Users:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail('john@example.com')
                  setName('John Doe')
                }}
                className="w-full justify-start"
              >
                John Doe (john@example.com)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail('sarah@example.com')
                  setName('Sarah Wilson')
                }}
                className="w-full justify-start"
              >
                Sarah Wilson (sarah@example.com)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}