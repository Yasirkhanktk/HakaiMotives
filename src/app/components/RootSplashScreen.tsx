'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from './SplashScreen'

export function RootSplashScreen() {
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hakai-splash-seen')
    if (!hasSeenSplash) {
      setShowSplash(true)
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    }
  }, [])

  const handleComplete = () => {
    sessionStorage.setItem('hakai-splash-seen', '1')
    setShowSplash(false)
    document.body.style.overflow = ''
    document.body.style.height = ''
  }

  if (!showSplash) return null

  return <SplashScreen onComplete={handleComplete} />
}
