'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, ArrowRight, Microscope, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { apiClient, User as UserType } from '@/lib/api-client'

interface LoginProps {
  onLogin: (user: UserType, token: string) => void
  onBack?: () => void
  onSwitchToSignup?: () => void
}

export function Login({ onLogin, onBack, onSwitchToSignup }: LoginProps) {
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMode, setLoginMode] = useState<'demo' | 'credentials'>('demo')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

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

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!credentials.email || !credentials.password) {
      setError('Email and password are required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/mongodb-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      onLogin(data.user, data.token)
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
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
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        )}

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
            {loginMode === 'credentials' ? 'Sign in to continue' : 'Select your role to continue'}
          </p>
        </div>

        {/* Toggle Between Login Modes */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginMode('credentials')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginMode === 'credentials'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setLoginMode('demo')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginMode === 'demo'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Demo Accounts
          </button>
        </div>

        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Credentials Login Form */}
        {loginMode === 'credentials' && (
          <motion.form
            onSubmit={handleCredentialsLogin}
            className="space-y-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
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
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Demo Account Selection */}
        {loginMode === 'demo' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
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
        </div>
          </motion.div>
        )}

        {/* Switch to Signup */}
        {onSwitchToSignup && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Powered by AI • Built for Innovation
          </p>
        </div>
      </motion.div>
    </div>
  )
}