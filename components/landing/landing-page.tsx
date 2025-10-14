'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Upload, Brain, BarChart3, Clock, Scale, Lightbulb, Zap } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">Intelli-Review</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
              From Paperwork to Pipeline
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-blue-200">
              Intelligent R&D Evaluation
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform uses a RAG engine to analyze, score, and prioritize 
              research proposals with unparalleled speed and objectivity.
            </p>
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Intelli-Review
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-center mb-16">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Upload Proposal</h4>
                <p className="text-gray-400">
                  Simply drag and drop your research proposal document
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">AI Analyzes</h4>
                <p className="text-gray-400">
                  Our RAG engine evaluates novelty, merit, and compliance
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Get Insights</h4>
                <p className="text-gray-400">
                  Receive comprehensive scoring and actionable recommendations
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-center mb-16">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Clock className="w-12 h-12 text-green-400 mb-6" />
                <h4 className="text-2xl font-semibold mb-4">90% Faster Screening</h4>
                <p className="text-gray-400 leading-relaxed">
                  Eliminate manual reading and focus expert time where it matters most. 
                  Process hundreds of proposals in minutes.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Scale className="w-12 h-12 text-blue-400 mb-6" />
                <h4 className="text-2xl font-semibold mb-4">Objective & Unbiased</h4>
                <p className="text-gray-400 leading-relaxed">
                  Data-driven scoring based on historical performance and S&T guidelines. 
                  Eliminate human bias from initial screening.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <Lightbulb className="w-12 h-12 text-yellow-400 mb-6" />
                <h4 className="text-2xl font-semibold mb-4">Actionable Insights</h4>
                <p className="text-gray-400 leading-relaxed">
                  Receive a clear summary, novelty analysis, and financial check for every 
                  proposal with explainable AI reasoning.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Evaluation Process?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the future of R&D proposal evaluation. Start analyzing proposals intelligently today.
            </p>
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 text-center text-gray-400 border-t border-white/10">
          <p>© 2025 Intelli-Review. Powered by AI. Built for Innovation.</p>
        </footer>
      </div>
    </div>
  )
}