'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Network, Search, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ProcessingStage {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  duration: number // seconds
}

const stages: ProcessingStage[] = [
  {
    id: 'upload',
    title: 'Document Upload',
    description: 'Extracting text from PDF and preparing for analysis',
    icon: FileText,
    duration: 3,
  },
  {
    id: 'embedding',
    title: 'Text Embedding',
    description: 'Converting proposal text into semantic vectors using transformer models',
    icon: Network,
    duration: 5,
  },
  {
    id: 'clustering',
    title: 'Cluster Matching',
    description: 'Finding similar proposals using vector similarity search',
    icon: Search,
    duration: 4,
  },
  {
    id: 'analysis',
    title: 'AI Analysis',
    description: 'Evaluating novelty, technical merit, and financial viability with Gemini AI',
    icon: Sparkles,
    duration: 8,
  },
]

interface ProcessingStagesProps {
  onComplete?: () => void
  status?: 'processing' | 'complete' | 'failed'
}

export function ProcessingStages({ onComplete, status = 'processing' }: ProcessingStagesProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'complete') {
      setCompletedStages(new Set(stages.map(s => s.id)))
      setCurrentStageIndex(stages.length)
      onComplete?.()
      return
    }

    if (status === 'failed') {
      return
    }

    const timer = setTimeout(() => {
      if (currentStageIndex < stages.length - 1) {
        setCompletedStages(prev => new Set([...prev, stages[currentStageIndex].id]))
        setCurrentStageIndex(prev => prev + 1)
      } else if (currentStageIndex === stages.length - 1) {
        // Stay on last stage until actual completion
        setCompletedStages(prev => new Set([...prev, stages[currentStageIndex].id]))
      }
    }, stages[currentStageIndex].duration * 1000)

    return () => clearTimeout(timer)
  }, [currentStageIndex, status, onComplete])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ 
              width: status === 'complete' 
                ? '100%' 
                : `${((currentStageIndex + 1) / stages.length) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Processing</span>
          <span>
            {status === 'complete' 
              ? '100%' 
              : `${Math.round(((currentStageIndex + 1) / stages.length) * 100)}%`}
          </span>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = completedStages.has(stage.id) || status === 'complete'
          const isCurrent = currentStageIndex === index && status === 'processing'
          const isPending = index > currentStageIndex && status === 'processing'
          const Icon = stage.icon

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative flex items-start gap-4 p-4 rounded-lg border transition-all duration-300
                ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}
                ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' : ''}
                ${isPending ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60' : ''}
              `}
            >
              {/* Icon */}
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all duration-300
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isCurrent ? 'bg-blue-500 text-white' : ''}
                ${isPending ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`
                    font-semibold transition-colors duration-300
                    ${isCompleted ? 'text-green-700 dark:text-green-300' : ''}
                    ${isCurrent ? 'text-blue-700 dark:text-blue-300' : ''}
                    ${isPending ? 'text-gray-600 dark:text-gray-400' : ''}
                  `}>
                    {stage.title}
                  </h3>
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </motion.div>
                  )}
                </div>
                <p className={`
                  text-sm mt-1 transition-colors duration-300
                  ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                  ${isCurrent ? 'text-blue-600 dark:text-blue-400' : ''}
                  ${isPending ? 'text-gray-500 dark:text-gray-500' : ''}
                `}>
                  {stage.description}
                </p>

                {/* Processing Animation */}
                {isCurrent && (
                  <motion.div
                    className="mt-3 h-1 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ 
                        duration: stage.duration, 
                        ease: 'linear',
                        repeat: status === 'processing' ? Infinity : 0
                      }}
                    />
                  </motion.div>
                )}

                {/* Completion Check */}
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 text-xs font-medium text-green-600 dark:text-green-400"
                  >
                    ✓ Completed
                  </motion.div>
                )}
              </div>

              {/* Stage Number */}
              <div className={`
                text-xs font-bold transition-colors duration-300
                ${isCompleted ? 'text-green-400 dark:text-green-500' : ''}
                ${isCurrent ? 'text-blue-400 dark:text-blue-500' : ''}
                ${isPending ? 'text-gray-400 dark:text-gray-600' : ''}
              `}>
                {index + 1}/{stages.length}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {status === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-lg text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
              Analysis Complete!
            </h3>
            <p className="text-green-600 dark:text-green-400">
              Your proposal has been successfully evaluated and is ready to view.
            </p>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full mb-4">
              <span className="text-3xl">✕</span>
            </div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
              Processing Failed
            </h3>
            <p className="text-red-600 dark:text-red-400">
              There was an error processing your proposal. Please try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
