'use client'

import { motion } from 'framer-motion'

interface ScoreCircleProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreCircle({ score, size = 'md' }: ScoreCircleProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const radius = size === 'sm' ? 28 : size === 'md' ? 44 : 60
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e' // green
    if (score >= 60) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${radius * 2 + 8} ${radius * 2 + 8}`}
      >
        {/* Background circle */}
        <circle
          cx={radius + 4}
          cy={radius + 4}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={radius + 4}
          cy={radius + 4}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className={`font-bold ${textSizes[size]} text-gray-900`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  )
}