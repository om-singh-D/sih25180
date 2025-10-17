'use client'

import { motion } from 'framer-motion'
import { LoadingSpinner, PulsingDot } from './loading'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

interface StatusBadgeProps {
  status: 'processing' | 'complete' | 'failed'
  animate?: boolean
}

export function StatusBadge({ status, animate = true }: StatusBadgeProps) {
  const isProcessing = status === 'processing'
  const isFailed = status === 'failed'
  const isComplete = status === 'complete'
  
  const badgeClasses = isProcessing
    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
    : isFailed
    ? 'bg-red-100 text-red-800 border-red-200'
    : 'bg-green-100 text-green-800 border-green-200'

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${badgeClasses}`}
      initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {isProcessing ? (
        <>
          <PulsingDot color="#f59e0b" />
          Processing
        </>
      ) : isFailed ? (
        <>
          <AlertCircle className="w-3 h-3" />
          Failed
        </>
      ) : (
        <>
          <CheckCircle className="w-3 h-3" />
          Complete
        </>
      )}
    </motion.div>
  )
}