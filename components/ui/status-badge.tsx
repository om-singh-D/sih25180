'use client'

import { motion } from 'framer-motion'
import { LoadingSpinner, PulsingDot } from './loading'

interface StatusBadgeProps {
  status: 'processing' | 'complete'
  animate?: boolean
}

export function StatusBadge({ status, animate = true }: StatusBadgeProps) {
  const isProcessing = status === 'processing'
  
  const badgeClasses = isProcessing
    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
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
      ) : (
        <>
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          Complete
        </>
      )}
    </motion.div>
  )
}