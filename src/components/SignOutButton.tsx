'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import React from 'react'

export default function SignOutButton({ ...props }: React.ComponentProps<typeof Button>) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      toast.error(`Sign out failed: ${error.message}`)
    } else {
      toast.success('Signed out successfully!')
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <Button 
      onClick={handleSignOut} 
      variant={props.variant || 'outline'}
      className={`${props.className || ''} dark:bg-blue-800 dark:text-white dark:border-blue-700 dark:hover:bg-blue-700`}
    >
      {props.children || 'Sign Out'}
    </Button>
  )
} 