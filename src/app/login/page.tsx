'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast" // Assuming useToast is available via shadcn - Removed
import { toast } from "sonner"
import Link from 'next/link'

// Vynutit dynamické renderování této stránky
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()
  // const { toast } = useToast() // Assuming shadcn provides useToast hook - Removed

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      // Use sonner toast for error
      toast.error(`Login Failed: ${error.message}`)
    } else {
      // Use sonner toast for success
      toast.success('Login Successful! Redirecting...')
      // Redirect to dashboard on successful login
      router.push('/dashboard')
      router.refresh() // Refresh server components
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div></div> {/* Prázdný element pro zarovnání */}
              <Link href="#" className="text-primary underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      {/* Add Toaster component from sonner here, usually placed in the root layout */}
      {/* <Toaster /> */}
    </div>
  )
} 