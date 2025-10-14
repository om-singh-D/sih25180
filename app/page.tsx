'use client'

import { useState, useEffect } from 'react'
import { LandingPage } from '@/components/landing/landing-page'
import { Login } from '@/components/auth/login'
import { Signup } from '@/components/auth/signup'
import { EnhancedUserDashboard } from '@/components/dashboard/enhanced-user-dashboard'
import { NACCRDashboard } from '@/components/dashboard/naccr-dashboard'
import { User } from '@/lib/api-client'

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Check for saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('currentUser')
      
      if (savedToken && savedUser) {
        setToken(savedToken)
        setCurrentUser(JSON.parse(savedUser))
        setCurrentView('dashboard')
      }
    }
  }, [])

  const handleGetStarted = () => {
    setCurrentView('login')
  }

  const handleSignup = () => {
    setCurrentView('signup')
  }

  const handleLogin = (user: User, authToken: string) => {
    setCurrentUser(user)
    setToken(authToken)
    setCurrentView('dashboard')
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('authToken', authToken)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setToken(null)
    setCurrentView('landing')
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
    }
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const handleSwitchToLogin = () => {
    setCurrentView('login')
  }

  const handleSwitchToSignup = () => {
    setCurrentView('signup')
  }

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} onSignup={handleSignup} />
  }

  if (currentView === 'signup') {
    return (
      <Signup 
        onSignup={handleLogin} 
        onBack={handleBackToLanding}
        onSwitchToLogin={handleSwitchToLogin}
      />
    )
  }

  if (currentView === 'login' || !currentUser || !token) {
    return <Login onLogin={handleLogin} onBack={handleBackToLanding} onSwitchToSignup={handleSwitchToSignup} />
  }

  return (
    <>
      {currentUser.role === 'naccr' ? (
        <NACCRDashboard userName={currentUser.name} onLogout={handleLogout} />
      ) : (
        <EnhancedUserDashboard userName={currentUser.name} onLogout={handleLogout} />
      )}
    </>
  )
}
