"use client"

import { signIn, getProviders } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, Trophy, ArrowLeft, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

type Provider = {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-800/20 dark:to-purple-800/20 animate-pulse"></div>
        </div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 -mt-20">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 animate-float">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to FantasyHub
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Sign in to access your fantasy empire
            </p>
          </div>

          <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"></div>
            <CardHeader className="relative text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Choose your preferred sign-in method
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              {providers &&
                Object.values(providers).map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {provider.name === "GitHub" && (
                        <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                          <Github className="w-5 h-5 text-white dark:text-slate-900" />
                        </div>
                      )}
                      {provider.name === "Google" && (
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="font-medium">Continue with {provider.name}</span>
                    </div>
                  </Button>
                ))}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Quick & Secure Authentication
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      New to FantasyHub?
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Signing in will automatically create your account with all premium features unlocked for 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            <p>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}