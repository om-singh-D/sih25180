'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Eye, Clock, CheckCircle } from 'lucide-react'
import { apiClient, Proposal, AnalysisResult } from '@/lib/api-client'
import { FileUpload } from '../ui/file-upload'
import { StatusBadge } from '../ui/status-badge'
import { ScoreCircle } from '../ui/score-circle'
import { ResultModal } from '../ui/result-modal'
import { LoadingSpinner } from '../ui/loading'

export function UserDashboard({ userName }: { userName: string }) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
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
      const response = await apiClient.getMyProposals()
      setProposals(response.proposals)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return

    setIsUploading(true)
    try {
      const response = await apiClient.uploadProposal(selectedFile, title.trim())
      console.log('Upload successful:', response.jobId)
      
      // Reset form
      setSelectedFile(null)
      setTitle('')
      setShowUploadForm(false)
      
      // Refresh proposals
      await fetchProposals()
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {userName}
        </h1>
        <p className="text-gray-600">
          Upload and track your proposal submissions
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        {!showUploadForm ? (
          <div className="text-center">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Submit New Proposal
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your proposal document for AI-powered analysis
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Upload
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload New Proposal
              </h3>
              <button
                onClick={() => {
                  setShowUploadForm(false)
                  setSelectedFile(null)
                  setTitle('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your proposal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isUploading}
              />
            </div>

            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onRemoveFile={() => setSelectedFile(null)}
              isUploading={isUploading}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !title.trim() || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {isUploading && <LoadingSpinner size="sm" color="white" />}
                {isUploading ? 'Uploading...' : 'Upload Proposal'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            My Proposals ({proposals.length})
          </h2>
        </div>

        {proposals.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No proposals yet
            </h3>
            <p className="text-gray-600">
              Upload your first proposal to get started with the analysis
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {proposal.filename}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {formatDate(proposal.submittedAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-4">
                    <StatusBadge status={proposal.status} />
                    
                    {proposal.status === 'complete' && (
                      <div className="flex items-center gap-3">
                        <ScoreCircle score={88} size="sm" />
                        <button
                          onClick={() => handleViewResult(proposal.id)}
                          disabled={loadingResults === proposal.id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          {loadingResults === proposal.id ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          View Results
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
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
  )
}