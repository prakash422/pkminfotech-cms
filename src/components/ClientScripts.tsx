"use client"

import { useEffect, useState } from 'react'

export default function ClientScripts() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render on client-side to prevent hydration issues
  if (!isClient) {
    return null
  }

  // Temporarily disable AdSense to stop errors
  // Will re-enable with a better approach
  return null
}
