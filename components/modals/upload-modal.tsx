'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, File, CheckCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { ProcessingStages } from '../upload/processing-stages'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, title: string) => Promise<void>
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [showProcessing, setShowProcessing] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'complete' | 'failed'>('processing')
  const [watchProcessing, setWatchProcessing] = useState(true) // New state for toggle

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        if (!title) {
          const filename = acceptedFiles[0].name.replace(/\.[^/.]+$/, '')
          setTitle(filename)
        }
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: isUploading
  })

  const handleUpload = async () => {
    if (!file || !title.trim()) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    try {
      await onUpload(file, title.trim())
      setUploadComplete(true)
      
      if (watchProcessing) {
        // Show processing stages after upload completes
        setTimeout(() => {
          setShowProcessing(true)
        }, 1000)
      } else {
        // Close immediately for background processing
        setTimeout(() => {
          handleClose()
        }, 1500)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Poll for job status
  useEffect(() => {
    if (!showProcessing || !jobId) return

    const pollInterval = setInterval(async () => {
      try {
        // This would call your status API
        // For now, we'll simulate it completing after all stages
        // In production, you'd check: await apiClient.getProposalStatus(jobId)
      } catch (error) {
        console.error('Failed to poll status:', error)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [showProcessing, jobId])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isUploading])

  const handleProcessingComplete = () => {
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  const handleClose = () => {
    // Allow closing anytime now - processing continues in background
    setFile(null)
    setTitle('')
    setUploadProgress(0)
    setUploadComplete(false)
    setShowProcessing(false)
    setJobId(null)
    setProcessingStatus('processing')
    setWatchProcessing(true) // Reset to default
    setIsUploading(false) // Reset uploading state
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isUploading ? handleClose : undefined}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">
                    {showProcessing ? 'Processing Your Proposal' : 'Upload New Proposal'}
                  </h2>
                </div>
                {/* Close button - always visible except during active upload */}
                {!isUploading && (
                  <button
                    onClick={handleClose}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors group"
                    title={showProcessing ? 'Close (processing continues in background)' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {showProcessing && (
                <p className="text-white/90 text-sm mt-2">
                  You can close this and continue working. We'll notify you when it's ready! ✨
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {showProcessing ? (
                <>
                  <ProcessingStages 
                    status={processingStatus}
                    onComplete={handleProcessingComplete}
                  />
                  {/* Background button during processing */}
                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                      Continue in Background
                    </button>
                  </div>
                </>
              ) : !uploadComplete ? (
                <>
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposal Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title for your proposal"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isUploading}
                    />
                  </div>

                  {/* File Upload Area */}
                  {!file ? (
                    <div
                      {...getRootProps()}
                      className={`
                        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                        ${isDragActive 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input {...getInputProps()} />
                      <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                      {isDragActive ? (
                        <p className="text-blue-600 font-medium text-lg">Drop the file here...</p>
                      ) : (
                        <div>
                          <p className="text-gray-700 font-medium text-lg mb-2">
                            Drag & drop your proposal file here
                          </p>
                          <p className="text-sm text-gray-500">
                            or click to browse • PDF, DOC, DOCX (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      className="border-2 border-green-300 bg-green-50 rounded-xl p-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <File className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-900">{file.name}</p>
                            <p className="text-sm text-green-700">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {!isUploading && (
                          <button
                            onClick={() => setFile(null)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Processing Options Toggle */}
                  {!isUploading && file && title.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {watchProcessing ? '👁️ Watch Processing' : '⚡ Background Processing'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {watchProcessing 
                              ? 'See the AI analysis pipeline in action with animations'
                              : 'Upload and close - we\'ll notify you when complete'
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setWatchProcessing(!watchProcessing)}
                        className={`
                          relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                          ${watchProcessing ? 'bg-blue-500' : 'bg-gray-300'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform
                            ${watchProcessing ? 'translate-x-7' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={handleClose}
                      disabled={isUploading}
                      className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!file || !title.trim() || isUploading}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Proposal'}
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
                  <p className="text-gray-600">
                    {watchProcessing 
                      ? 'Your proposal is now being analyzed...'
                      : 'Your proposal is being analyzed in the background. Check your dashboard for updates!'
                    }
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}