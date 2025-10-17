'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Eye, Search, FileText } from 'lucide-react'
import { apiClient, Proposal } from '@/lib/api-client'
import { DashboardLayout } from '../layout/dashboard-layout'
import { UploadModal } from '../modals/upload-modal'
import { DetailedReportModal } from '../modals/detailed-report-modal'
import { StatusBadge } from '../ui/status-badge'
import { ScoreCircle } from '../ui/score-circle'
import { LoadingSpinner } from '../ui/loading'
import { Toast } from '../ui/toast'

export function EnhancedUserDashboard({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [loadingResults, setLoadingResults] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  // Polling for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const processingProposals = proposals.filter(p => p.status === 'processing')
      if (processingProposals.length > 0) {
        const oldProposals = proposals
        await fetchProposals()
        
        // Check if any proposal just completed
        const response = await apiClient.getMyProposals()
        response.proposals.forEach((newProposal: Proposal) => {
          const oldProposal = oldProposals.find(p => p.id === newProposal.id)
          if (oldProposal?.status === 'processing' && newProposal.status === 'complete') {
            // Show notification
            setToastMessage(`🎉 Analysis complete for "${newProposal.title}"!`)
            setToastType('success')
            setShowToast(true)
          }
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [proposals])

  const fetchProposals = async () => {
    try {
      const response = await apiClient.getMyProposals()
      setProposals(response.proposals)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    }
  }

  const handleUpload = async (file: File, title: string) => {
    const response = await apiClient.uploadProposal(file, title)
    await fetchProposals()
  }

  const handleViewResult = async (jobId: string) => {
    setLoadingResults(jobId)
    console.log('[Dashboard] Viewing result for jobId:', jobId);
    try {
      const result = await apiClient.getProposalResult(jobId)
      console.log('[Dashboard] Got result:', result);
      setSelectedResult(result)
      setShowResultModal(true)
    } catch (error) {
      console.error('Failed to fetch result:', error)
      alert('Failed to load results. The proposal may still be processing or there was an error. Please try again.')
    } finally {
      setLoadingResults(null)
    }
  }

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
    const failed = proposals.filter(p => p.status === 'failed').length
    const avgScore = complete > 0 ? 78 : undefined // Mock average

    return { total, processing, complete, failed, avgScore }
  }

  const filteredProposals = proposals
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
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

  useEffect(() => {
    fetchProposals()
  }, [])

  return (
    <DashboardLayout
      userName={userName}
      userRole="user"
      onLogout={onLogout}
      stats={getStats()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Proposals Dashboard</h1>
          <p className="text-gray-600">Track and analyze your research proposals</p>
        </div>
        <motion.button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Upload New Proposal
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredProposals.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No proposals found' : 'No proposals yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Upload your first proposal to get started with AI-powered analysis'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Upload Proposal
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Proposal Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cluster
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredProposals.map((proposal, index) => (
                    <motion.tr
                      key={proposal.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {proposal.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {proposal.filename}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(proposal.submittedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Mine Safety
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={proposal.status} />
                      </td>
                      <td className="px-6 py-4">
                        {proposal.status === 'complete' ? (
                          <ScoreCircle score={88} size="sm" />
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {proposal.status === 'complete' && (
                          <motion.button
                            onClick={() => handleViewResult(proposal.id)}
                            disabled={loadingResults === proposal.id}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {loadingResults === proposal.id ? (
                              <LoadingSpinner size="sm" color="white" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                            View Report
                          </motion.button>
                        )}
                        {proposal.status === 'failed' && (
                          <button
                            onClick={() => {
                              const errorMsg = (proposal as any).errorMessage || 'Analysis failed. Please try uploading the proposal again.'
                              setToastMessage(`❌ ${errorMsg}`)
                              setToastType('error')
                              setShowToast(true)
                            }}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                          >
                            View Error
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <DetailedReportModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={selectedResult}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </DashboardLayout>
  )
}