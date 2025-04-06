'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Vynutit dynamické renderování této stránky
export const dynamic = 'force-dynamic';

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${location.origin}/auth/callback`, // Optional: redirect after email confirmation
      },
    })

    if (error) {
      console.error('Signup error:', error.message)
      toast.error(`Signup Failed: ${error.message}`)
    } else if (data.user && data.user.identities?.length === 0) {
        // This condition checks if email confirmation is required but not yet done.
        console.log('Signup successful, email confirmation required.')
        toast.info('Signup successful! Please check your email to confirm your account.')
        // Optionally redirect to a page informing the user to check their email
        // router.push('/check-email');
    } else if (data.user) {
        // This case handles scenarios where email confirmation might be disabled or auto-confirmed.
        console.log('Signup successful and user confirmed.')
        toast.success('Signup Successful! Redirecting...')
        // Redirect to dashboard or login page after successful signup
        router.push('/dashboard') // Or maybe router.push('/login') asking them to log in now?
        router.refresh()
    } else {
         // Fallback for unexpected issues
         console.error('Signup failed for an unknown reason')
         toast.error('Signup failed. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password to create an account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6} // Add minimum password length for Supabase default policy
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Password must be at least 6 characters.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Create account
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 