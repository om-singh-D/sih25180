'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, FileText, TrendingUp, DollarSign, Lightbulb } from 'lucide-react'
import { AnalysisResult } from '@/lib/api-client'
import { ScoreCircle } from '../ui/score-circle'

interface DetailedReportModalProps {
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

export function DetailedReportModal({ isOpen, onClose, result }: DetailedReportModalProps) {
  if (!result) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              <motion.div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{result.title}</h2>
                        <p className="text-blue-100 text-sm mt-1">Comprehensive Analysis Report</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <ScoreCircle score={result.result.score} size="md" />
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content - 3 Column Layout */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN - AI Summary */}
                    <motion.div
                      className="lg:col-span-1 space-y-6"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">AI-Generated Summary</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {result.result.summary}
                        </p>
                      </div>

                      {/* File Info */}
                      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Document Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">File:</span>
                            <span className="text-gray-900 font-medium">{result.filename}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submitted:</span>
                            <span className="text-gray-900 font-medium">
                              {new Date(result.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Analyzed:</span>
                            <span className="text-gray-900 font-medium">
                              {new Date(result.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Job ID:</span>
                            <span className="text-gray-900 font-mono text-xs">{result.jobId.slice(0, 16)}...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* MIDDLE COLUMN - Key Metrics */}
                    <motion.div
                      className="lg:col-span-1 space-y-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Metrics</h3>
                        <p className="text-gray-600 text-sm">Key evaluation indicators</p>
                      </div>

                      {/* Overall Score */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-purple-900">Overall Score</h4>
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-6xl font-bold text-purple-600">{result.result.score}</span>
                          <span className="text-2xl text-purple-400 ml-1">/100</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${result.result.score}%` }}
                            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Novelty Analysis */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          {result.result.noveltyAnalysis.isNovel ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                          )}
                          <h4 className="font-semibold text-gray-900">Novelty Check</h4>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Innovation Level:</span>
                          <span className={`text-sm font-bold ${result.result.noveltyAnalysis.isNovel ? 'text-green-600' : 'text-yellow-600'}`}>
                            {result.result.noveltyAnalysis.isNovel ? 'HIGHLY NOVEL' : 'MODERATE'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Technique:</span>
                          <span className="text-sm font-medium text-gray-900">Graphene-based</span>
                        </div>
                      </div>

                      {/* Financial Analysis */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          {result.result.financialAnalysis.isCompliant ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          )}
                          <h4 className="font-semibold text-gray-900">Financial Check</h4>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Budget Status:</span>
                          <span className={`text-sm font-bold ${result.result.financialAnalysis.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                            {result.result.financialAnalysis.isCompliant ? 'COMPLIANT' : 'REVIEW NEEDED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cost Efficiency:</span>
                          <span className="text-sm font-medium text-green-600">+10% Better</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* RIGHT COLUMN - Context & Evidence */}
                    <motion.div
                      className="lg:col-span-1 space-y-6"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Analysis</h3>
                        
                        {/* Novelty Justification */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Innovation Assessment
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {result.result.noveltyAnalysis.justification}
                          </p>
                        </div>

                        {/* Financial Justification */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Budget Assessment
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {result.result.financialAnalysis.justification}
                          </p>
                        </div>
                      </div>

                      {/* Similar Projects */}
                      {result.result.noveltyAnalysis.similarProjects.length > 0 && (
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Context & Similar Projects</h3>
                          <p className="text-xs text-gray-600 mb-4">
                            Based on RAG analysis of historical database
                          </p>
                          <div className="space-y-3">
                            {result.result.noveltyAnalysis.similarProjects.map((project, index) => (
                              <motion.div
                                key={index}
                                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-mono text-gray-500">{project.id}</span>
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {project.similarity} Match
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{project.title}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Footer Actions */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Analysis Engine:</span> RAG-powered AI v2.0
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Close Report
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}