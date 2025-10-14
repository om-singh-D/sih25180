'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { AnalysisResult } from '@/lib/api-client'
import { ScoreCircle } from './score-circle'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: {
    jobId: string
    title: string
    filename: string
    submittedAt: string
    completedAt: string
    result: AnalysisResult
  } | null
}

export function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  if (!result) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">Analysis Results</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Score Section */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h3>
                <ScoreCircle score={result.result.score} size="lg" />
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  {result.result.summary}
                </p>
              </div>

              {/* Novelty Analysis */}
              <motion.div
                className="bg-blue-50 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {result.result.noveltyAnalysis.isNovel ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    Novelty Analysis
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  {result.result.noveltyAnalysis.justification}
                </p>
                
                {result.result.noveltyAnalysis.similarProjects.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Similar Projects:</h4>
                    <div className="space-y-2">
                      {result.result.noveltyAnalysis.similarProjects.map((project, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded p-3">
                          <span className="text-gray-800">{project.title}</span>
                          <span className="text-sm font-medium text-blue-600">{project.similarity} similar</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Financial Analysis */}
              <motion.div
                className="bg-green-50 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {result.result.financialAnalysis.isCompliant ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    Financial Analysis
                  </h3>
                </div>
                <p className="text-gray-700">
                  {result.result.financialAnalysis.justification}
                </p>
              </motion.div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">File:</span>
                    <span className="ml-2 text-gray-600">{result.filename}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(result.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Completed:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(result.completedAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Job ID:</span>
                    <span className="ml-2 text-gray-600 font-mono text-xs">{result.jobId}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}