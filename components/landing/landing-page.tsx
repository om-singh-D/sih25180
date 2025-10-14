'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Clock, Scale, Lightbulb, Brain, TrendingUp, FileSearch, Upload, BarChart3, Shield, Microscope, Trophy, Link2, Rocket, CheckCircle2, FileText, ScrollText } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const faqItems = [
    {
      id: 'item-1',
      question: 'How does the RAG-powered analysis work?',
      answer: 'DARPAN uses a RAG (Retrieval-Augmented Generation) engine that acts as a digital mirror, reflecting proposals against a comprehensive database of historical submissions, S&T guidelines, and best practices. It evaluates novelty, technical merit, and financial viability with contextual understanding.',
    },
    {
      id: 'item-2',
      question: 'What file formats are supported?',
      answer: 'We accept PDF, DOC, and DOCX formats up to 10MB. The system can extract and analyze text, tables, and structured data from these documents instantly.',
    },
    {
      id: 'item-3',
      question: 'How accurate is the scoring system?',
      answer: 'Our AI model has been trained on thousands of historical proposals and achieves 92% alignment with expert evaluations. Every score is transparent, auditable, and backed by data-driven evidence.',
    },
    {
      id: 'item-4',
      question: 'Is my proposal data secure?',
      answer: 'Absolutely. We implement enterprise-grade encryption (AES-256), secure data transmission (TLS 1.3), and strict access controls. All data is processed in compliance with government security standards.',
    },
    {
      id: 'item-5',
      question: 'Can this integrate with existing NaCCER systems?',
      answer: 'Yes! We provide REST APIs and webhooks for seamless integration with your existing proposal management systems. The platform supports OAuth 2.0 and SSO for enterprise deployments.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Project DARPAN</span>
                <span className="text-xs text-muted-foreground">Reflecting True Merit</span>
              </div>
            </div>
            <Button
              onClick={onGetStarted}
              variant="ghost"
              className="border"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
          <motion.div
            className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-full">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">दर्पण - The Mirror of Merit</span>
            </div>
            <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 xl:text-7xl">
              From Months to Minutes: The Future of R&D Evaluation
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
              Project DARPAN acts as a digital mirror for R&D evaluation. Using state-of-the-art RAG technology, 
              it reflects the true merit of each proposal, helping NaCCER accelerate innovation with data-driven clarity.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-6 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl shadow-lg"
              >
                <span className="text-nowrap">Launch the Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="px-6 text-base border"
              >
                <span className="text-nowrap">Watch Demo</span>
              </Button>
            </div>
          </motion.div>
          <Image
            className="-z-10 order-first ml-auto h-56 w-full object-cover sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3 lg:object-contain opacity-60"
            src="/hero section.jpg"
            alt="DARPAN - AI Analysis Visualization"
            height="4000"
            width="3000"
          />
        </div>
      </section>

      {/* Trust Bar - Social Proof */}
      <section className="py-12 border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-6">AS ENVISIONED FOR</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg">Smart India Hackathon</span>
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg">Ministry of Coal</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg">Coal India Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg">CMPDI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold lg:text-5xl mb-4">The DARPAN Transformation</h2>
            <p className="text-lg text-muted-foreground">From bottleneck to breakthrough</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* The Old Way */}
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">The Old Way: A Bottleneck to Innovation</h3>
              </div>
              
              <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ScrollText className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Manual Overload</h4>
                      <p className="text-sm text-muted-foreground">
                        Experts spend hundreds of hours manually sifting through dense proposals, 
                        slowing down the entire funding lifecycle.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Subjective Bias</h4>
                      <p className="text-sm text-muted-foreground">
                        Inconsistent evaluations and human bias can lead to high-potential projects 
                        being overlooked while less viable ones advance.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* The DARPAN Way */}
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">The DARPAN Way: An Engine for Progress</h3>
              </div>
              
              <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Automated Intelligence</h4>
                      <p className="text-sm text-muted-foreground">
                        Our pipeline digitizes and analyzes proposals in minutes, freeing up your 
                        experts to focus on strategic decisions.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Objective & Data-Driven</h4>
                      <p className="text-sm text-muted-foreground">
                        Every proposal is scored against historical data, reflecting its true potential 
                        and ensuring fair, transparent, and auditable results.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-32 bg-muted/50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold lg:text-5xl mb-4">Get Actionable Insights in Three Simple Steps</h2>
            <p className="text-lg text-muted-foreground">DARPAN reflects the truth in minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center font-bold text-blue-600 border-2 border-blue-600">
                  1
                </div>
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Submit Any Proposal</h3>
              <p className="text-muted-foreground">
                Securely upload proposals in any standard format (PDF, DOCX). Our system instantly 
                ingests and digitizes the content for analysis.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center font-bold text-purple-600 border-2 border-purple-600">
                  2
                </div>
                <Microscope className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">DARPAN Reflects the Data</h3>
              <p className="text-muted-foreground">
                Our RAG-powered engine mirrors the proposal against a vast knowledge base of past 
                projects and guidelines to assess novelty, viability, and merit.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center font-bold text-cyan-600 border-2 border-cyan-600">
                  3
                </div>
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Receive Your Report</h3>
              <p className="text-muted-foreground">
                Get a comprehensive report on your dashboard, complete with an objective score, 
                an AI-generated summary, and data-backed justifications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 md:py-32">
        <div className="@container mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-balance text-4xl font-bold lg:text-5xl mb-4">A Feature Set Built for High-Impact Decisions</h2>
            <p className="text-lg text-muted-foreground">Powered by AI, guided by transparency</p>
          </div>
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto grid max-w-sm gap-6">
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Microscope className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-bold text-lg">RAG-Powered Contextual Analysis</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  DARPAN provides a clear reflection of a proposal's true novelty. It goes beyond keywords 
                  to understand context and methodology, ensuring a deep and meaningful evaluation.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Trophy className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-bold text-lg">Automated Scoring & Prioritization</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our intelligent scoring system ranks and color-codes every submission. Instantly see 
                  which proposals' merits shine brightest and fast-track them for expert review.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Shield className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-bold text-lg">Transparent & Auditable Reporting</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trust in the reflection. Our platform provides a transparent mirror into the "why" 
                  behind every score, with direct links to the evidence used in the analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-32 bg-muted/50">
        <div className="@container mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to Transform R&D Evaluation</h2>
            <p className="mt-4 text-muted-foreground">Powerful features that eliminate bias and accelerate proposal screening</p>
          </div>
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
            <Card className="group border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Clock className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-medium">90% Faster Screening</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Eliminate manual reading and focus expert time where it matters most. Process hundreds of proposals in minutes instead of weeks.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Scale className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-medium">Objective & Unbiased</h3>
              </CardHeader>
              <CardContent>
                <p className="mt-3 text-sm text-muted-foreground">
                  Data-driven scoring based on historical performance and S&T guidelines. Eliminate human bias from initial screening.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Lightbulb className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-medium">Actionable Insights</h3>
              </CardHeader>
              <CardContent>
                <p className="mt-3 text-sm text-muted-foreground">
                  Receive comprehensive summaries, novelty analysis, and financial checks with explainable AI reasoning for every proposal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <h2 className="text-4xl font-medium">
              The Intelli-Review ecosystem brings together AI models, RAG technology, and intelligent workflows.
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Intelli-Review is more than just an analysis tool. It supports an entire evaluation ecosystem — from automated screening to detailed reporting and expert collaboration.
              </p>
              <p className="text-muted-foreground">
                Our platform. <span className="font-bold">Leverages cutting-edge RAG architecture</span> — combining retrieval systems with generative AI to provide context-aware, explainable evaluations that align with your organization's standards and historical data.
              </p>
              <Button
                onClick={onGetStarted}
                variant="secondary"
                size="sm"
                className="gap-1 pr-1.5"
              >
                <span>Start Analyzing</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-32 bg-muted/50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold lg:text-5xl">How It Works</h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to intelligent proposal evaluation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileSearch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Proposal</h3>
              <p className="text-muted-foreground">
                Simply drag and drop your research proposal document (PDF, DOC, DOCX)
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analyzes</h3>
              <p className="text-muted-foreground">
                Our RAG engine evaluates novelty, technical merit, and compliance in real-time
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Insights</h3>
              <p className="text-muted-foreground">
                Receive comprehensive scoring, similar projects, and actionable recommendations
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-4 text-balance">
              Discover how DARPAN transforms R&D evaluation with transparency and efficiency.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <Accordion
              type="single"
              collapsible
              className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-dashed"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <p className="text-muted-foreground mt-6 px-8 text-center">
              Have more questions?{' '}
              <button
                onClick={onGetStarted}
                className="text-primary font-medium hover:underline"
              >
                Contact our support team
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/hero section.jpg')] opacity-10 bg-cover bg-center"></div>
        
        <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-semibold">Join the Revolution</span>
            </div>
            <h2 className="text-4xl font-bold lg:text-6xl mb-6">
              Ready to Revolutionize Your R&D Workflow?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-50 leading-relaxed">
              Step into the future of research funding. Reduce evaluation timelines, empower your experts, 
              and ensure the best ideas get the support they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl text-base px-8 py-6 text-lg font-semibold"
              >
                Analyze Your First Proposal for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm text-base px-8 py-6 text-lg font-semibold"
              >
                Schedule a Demo
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">90%</div>
                <div className="text-blue-100">Faster Evaluation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">92%</div>
                <div className="text-blue-100">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Transparent</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">Project DARPAN</span>
                <span className="text-xs text-muted-foreground">Reflecting True Merit</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              <strong>D</strong>ata-driven <strong>A</strong>nalytics & <strong>R</strong>anking of <strong>P</strong>roposals 
              for <strong>A</strong>dvanced <strong>N</strong>ovelty
            </p>
          </div>

          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-primary duration-150">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-primary duration-150">
              How It Works
            </Link>
            <Link href="#security" className="text-muted-foreground hover:text-primary duration-150">
              Security
            </Link>
            <Link href="#api" className="text-muted-foreground hover:text-primary duration-150">
              API Documentation
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-primary duration-150">
              About NaCCER
            </Link>
            <button onClick={onGetStarted} className="text-muted-foreground hover:text-primary duration-150">
              Contact
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p className="mb-2">© 2025 Project DARPAN. A Smart India Hackathon Initiative.</p>
            <p className="text-xs">Built for Ministry of Coal | Coal India Limited | CMPDI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
)