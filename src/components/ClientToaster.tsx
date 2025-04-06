'use client'

import { Toaster } from "@/components/ui/sonner"
import { useEffect, useState } from "react"

export default function ClientToaster() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render on the server or during initial hydration mismatch potential
  if (!isMounted) {
    return null
  }

  // Render Toaster only on the client after mount
  return <Toaster />
} 