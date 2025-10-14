'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Filter, Search, Users, Clock, CheckCircle, LogOut, Microscope } from 'lucide-react'
import { apiClient, Proposal } from '@/lib/api-client'
import { StatusBadge } from '../ui/status-badge'
import { ScoreCircle } from '../ui/score-circle'
import { ResultModal } from '../ui/result-modal'
import { LoadingSpinner } from '../ui/loading'

interface EnrichedProposal extends Proposal {
  userName?: string
  userEmail?: string
  overallScore?: number
  noveltyScore?: number
  technicalMeritScore?: number
  cluster?: string
}

export function NACCRDashboard({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [proposals, setProposals] = useState<EnrichedProposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<EnrichedProposal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'complete'>('all')
  const [clusterFilter, setClusterFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date')
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [loadingResults, setLoadingResults] = useState<string | null>(null)

  // Polling for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const processingProposals = proposals.filter(p => p.status === 'processing')
      if (processingProposals.length > 0) {
        await fetchProposals()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [proposals])

  const fetchProposals = async () => {
    try {
      const response = await apiClient.getAllProposals()
      setProposals(response.proposals)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    }
  }

  const handleViewResult = async (jobId: string) => {
    setLoadingResults(jobId)
    try {
      const result = await apiClient.getProposalResult(jobId)
      setSelectedResult(result)
      setShowResultModal(true)
    } catch (error) {
      console.error('Failed to fetch result:', error)
      alert('Failed to load results. Please try again.')
    } finally {
      setLoadingResults(null)
    }
  }

  // Filter and sort proposals
  useEffect(() => {
    let filtered = proposals

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(proposal =>
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter)
    }

    // Apply cluster filter
    if (clusterFilter !== 'all') {
      filtered = filtered.filter(proposal => (proposal as any).cluster === clusterFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    setFilteredProposals(filtered)
  }, [proposals, searchTerm, statusFilter, clusterFilter, sortBy])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStats = () => {
    const total = proposals.length
    const processing = proposals.filter(p => p.status === 'processing').length
    const complete = proposals.filter(p => p.status === 'complete').length
    const uniqueUsers = new Set(proposals.map(p => p.userId)).size

    return { total, processing, complete, uniqueUsers }
  }

  const getTopProposals = () => {
    return proposals
      .filter((p): p is EnrichedProposal & { overallScore: number } => 
        p.status === 'complete' && p.overallScore != null
      )
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 5)
  }

  const getClusterDistribution = () => {
    const clusterMap = new Map<string, number>()
    proposals.forEach(p => {
      const cluster = (p as any).cluster || 'Other'
      clusterMap.set(cluster, (clusterMap.get(cluster) || 0) + 1)
    })
    return Array.from(clusterMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  const stats = getStats()
  const topProposals = getTopProposals()
  const clusterDistribution = getClusterDistribution()

  useEffect(() => {
    fetchProposals()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Project DARPAN</h1>
                <p className="text-xs text-gray-600">NaCCER Administrative Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Administrative Dashboard
          </h2>
          <p className="text-gray-600">
            Monitor and review all proposal submissions
          </p>
        </div>

        {/* AI Recommendations & Clusters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Recommendations Panel */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border-2 border-purple-200 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Recommendations</h3>
                <p className="text-sm text-gray-600">Top-ranked proposals by AI analysis</p>
              </div>
            </div>
            
            {topProposals.length > 0 ? (
              <div className="space-y-3">
                {topProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white text-xs font-bold rounded-full">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {proposal.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">by {proposal.userName}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            Score: {proposal.overallScore}/100
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            Novelty: {proposal.noveltyScore}/100
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewResult(proposal.id)}
                        className="shrink-0 p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No completed analyses yet</p>
                <p className="text-xs mt-1">Recommendations will appear as proposals are analyzed</p>
              </div>
            )}
          </motion.div>

          {/* Cluster Distribution Panel */}
          <motion.div
            className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl shadow-lg border-2 border-cyan-200 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Research Clusters</h3>
                <p className="text-sm text-gray-600">Proposal distribution by domain</p>
              </div>
            </div>
            
            {clusterDistribution.length > 0 ? (
              <div className="space-y-3">
                {clusterDistribution.slice(0, 7).map((cluster, index) => {
                  const percentage = (cluster.count / proposals.length * 100).toFixed(1)
                  const colors = [
                    'bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
                    'bg-rose-500', 'bg-orange-500', 'bg-amber-500'
                  ]
                  return (
                    <motion.div
                      key={cluster.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{cluster.name}</span>
                        <span className="text-sm font-bold text-gray-900">{cluster.count}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${colors[index % colors.length]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage}% of total</div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No proposals yet</p>
                <p className="text-xs mt-1">Clusters will form as proposals are submitted</p>
              </div>
            )}
          </motion.div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Proposals</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complete</p>
              <p className="text-3xl font-bold text-green-600">{stats.complete}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-purple-600">{stats.uniqueUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search proposals, users, or files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="complete">Complete</option>
            </select>

            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-cyan-50"
            >
              <option value="all">All Clusters</option>
              {clusterDistribution.map(cluster => (
                <option key={cluster.name} value={cluster.name}>
                  {cluster.name} ({cluster.count})
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredProposals.length} of {proposals.length} proposals
          </div>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            All Proposals
          </h2>
        </div>

        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No proposals found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cluster
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProposals.map((proposal, index) => (
                  <motion.tr
                    key={proposal.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {proposal.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {proposal.filename}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {proposal.userName || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {proposal.userEmail || 'Unknown Email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={proposal.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(proposal.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-800">
                        {proposal.cluster || 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {proposal.status === 'complete' && proposal.overallScore != null ? (
                        <ScoreCircle score={proposal.overallScore} size="sm" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {proposal.status === 'complete' && (
                        <button
                          onClick={() => handleViewResult(proposal.id)}
                          disabled={loadingResults === proposal.id}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                          {loadingResults === proposal.id ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          View
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={selectedResult}
      />
      </div>
    </div>
  )
}