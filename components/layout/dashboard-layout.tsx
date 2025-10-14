'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Upload, Settings, LogOut, FileText, Clock, CheckCircle, TrendingUp, Microscope } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userRole: 'user' | 'naccr'
  onLogout: () => void
  stats: {
    total: number
    processing: number
    complete: number
    avgScore?: number
  }
}

export function DashboardLayout({ children, userName, userRole, onLogout, stats }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl"
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Project DARPAN</h1>
              <p className="text-xs text-gray-400">{userRole === 'naccr' ? 'NaCCER Panel' : 'User Portal'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <motion.button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </motion.button>

          {userRole === 'user' && (
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload New</span>
            </motion.button>
          )}

          <motion.button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </motion.button>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
          <motion.button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats Bar */}
        <motion.div
          className="bg-white border-b border-gray-200 px-8 py-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Proposals */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Proposals Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </motion.div>

            {/* Processing */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Expert Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </motion.div>

            {/* Complete */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Analysis Complete</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complete}</p>
              </div>
            </motion.div>

            {/* Average Score */}
            {stats.avgScore !== undefined && (
              <motion.div
                className="flex items-center gap-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Novelty Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgScore}%</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  )
}