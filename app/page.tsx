'use client'

import { useState, useEffect } from 'react'
import { Login } from '@/components/auth/login'
import { UserDashboard } from '@/components/dashboard/user-dashboard'
import { NACCRDashboard } from '@/components/dashboard/naccr-dashboard'
import { User } from '@/lib/api-client'
import { LogOut } from 'lucide-react'

export default function Home() {
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
      }
    }
  }, [])

  const handleLogin = (user: User, authToken: string) => {
    setCurrentUser(user)
    setToken(authToken)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('authToken', authToken)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setToken(null)
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
    }
  }

  if (!currentUser || !token) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Proposal Analysis System
                </h1>
                <p className="text-sm text-gray-600">
                  {currentUser.role === 'naccr' ? 'NACCR Administrative Panel' : 'User Dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-600 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentUser.role === 'naccr' ? (
          <NACCRDashboard userName={currentUser.name} />
        ) : (
          <UserDashboard userName={currentUser.name} />
        )}
      </main>
    </div>
  )
}
