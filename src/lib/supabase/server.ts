import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Upravíme implementaci pro Next.js 15
export async function createClient() {
  // Define Supabase environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Pro server components a API routes podporující await
  const cookieStore = await cookies()

  // Create and return the Supabase client
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete({
          name,
          ...options,
        })
      },
    },
  })
} 