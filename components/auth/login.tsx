'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, ArrowRight, Microscope } from 'lucide-react'
import { apiClient, User as UserType } from '@/lib/api-client'

interface LoginProps {
  onLogin: (user: UserType, token: string) => void
}

export function Login({ onLogin }: LoginProps) {
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.getUsers()
        setUsers(response.users)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    fetchUsers()
  }, [])

  const handleLogin = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const response = await apiClient.login(selectedUser)
      onLogin(response.user, response.token)
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Microscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Project DARPAN
          </h1>
          <p className="text-sm text-blue-600 font-semibold mb-3">
            Reflecting True Merit
          </p>
          <p className="text-gray-600">
            Select your role to continue
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {users.map((user, index) => (
            <motion.button
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedUser === user.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.role === 'naccr' ? 'bg-purple-100' : 'bg-green-100'
                  }`}>
                    {user.role === 'naccr' ? (
                      <Shield className={`w-5 h-5 ${
                        user.role === 'naccr' ? 'text-purple-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <User className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {user.role === 'naccr' ? 'NACCR Administrator' : 'User'}
                    </p>
                  </div>
                </div>
                {selectedUser === user.id && (
                  <motion.div
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={!selectedUser || isLoading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="mt-6 text-center space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 font-medium mb-1">
              ⚠️ Prototype Demo Accounts
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              These are sample accounts for demonstration purposes only. 
              The production system implements enterprise-grade authentication 
              with JWT tokens, OAuth 2.0, and multi-factor authentication.
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Powered by AI • Built for Innovation
          </p>
        </div>
      </motion.div>
    </div>
  )
}