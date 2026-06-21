import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Link } from "react-router-dom"
import {
  ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, FileText, Search,
  Award, ChevronDown, Star, Building2, Construction, Truck, Heart,
  GraduationCap, Wifi, Users, X, Menu, Bot, Target, PoundSterling,
  Clock, BarChart3, FileCheck, Layers, BookOpen, Globe, ChevronRight,
  Sparkles, Lock, RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { PRICING, ROUTES } from "@/lib/constants"
import DashboardMockup from "@/components/DashboardMockup"
import Logo from "@/components/Logo"

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0 })

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="text-3xl lg:text-4xl font-black text-white mb-1 tracking-tight">{value}</div>
      <div className="text-sm text-blue-300/60 font-medium">{label}</div>
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "£300bn+", label: "UK public procurement market" },
  { value: "£2.3bn+", label: "in matched opportunities" },
  { value: "34%",     label: "average win rate uplift" },
  { value: "500+",    label: "SMEs growing with BidIQ Pro" },
]

const JOURNEY_STEPS = [
  { label: "Find", desc: "Live tender alerts" },
  { label: "Qualify", desc: "AI fit scoring" },
  { label: "Prepare", desc: "Compliance check" },
  { label: "Bid", desc: "AI workspace" },
  { label: "Win", desc: "Submit & track" },
  { label: "Deliver", desc: "KPI tracking" },
  { label: "Renew", desc: "Contract renewal" },
  { label: "Scale", desc: "Grow pipeline" },
]

const PAIN_POINTS = [
  {
    icon: Search,
    title: "You don't know which contracts you're eligible for",
    body: "Thousands of notices are published every week across Find a Tender, Contracts Finder and buyer portals. Without intelligent filtering, the right ones slip past every time.",
  },
  {
    icon: FileText,
    title: "Bid documents take weeks of time your team doesn't have",
    body: "Writing compliant, compelling answers to method statements, social value questions and pricing schedules can take weeks — time most SME teams simply can't spare.",
  },
  {
    icon: Shield,
    title: "Missing compliance documents disqualify you at the wrong moment",
    body: "Expired insurance certificates, lapsed ISO accreditations or missing policies disqualify bids you could easily win. Most SMEs only discover this after submission.",
  },
  {
    icon: TrendingUp,
    title: "No visibility on deadlines, renewals or what's in your pipeline",
    body: "Without a structured bid pipeline, contracts renew without warning and opportunities are lost to better-organised competitors with bigger bid teams.",
  },
]

const SOLUTION_FEATURES = [
  {
    icon: Search,
    title: "AI Tender Discovery",
    body: "Match live public-sector opportunities to your capabilities, sectors and geography — daily alerts from Contracts Finder, Find a Tender, NHS Supply Chain and 200+ buyer portals.",
    color: "text-govgreen-600",
    bg: "bg-govgreen-50",
    border: "border-govgreen-100",
  },
  {
    icon: Target,
    title: "Procurement Readiness Score",
    body: "A 5-minute diagnostic that surfaces every compliance gap, missing document and capability shortfall blocking your next win — with a prioritised action plan.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Bot,
    title: "AI Bid Workspace",
    body: "Upload the tender pack. AI extracts questions, maps scoring criteria and drafts high-quality answers you refine. Human expertise stays central — AI handles the scaffolding.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: Lock,
    title: "Compliance Vault",
    body: "Store, track and auto-remind every certificate, policy and accreditation with expiry alerts 90, 30 and 7 days in advance. Never fail a compliance check again.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Layers,
    title: "Bid Pipeline CRM",
    body: "Kanban-style pipeline management across every stage — from spotted opportunity to post-award debrief — with deadline calendars and task assignments.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Award,
    title: "Contract Delivery Hub",
    body: "Structured KPI tracking, evidence capture and renewal preparation that turns good delivery into the next winning bid and builds a compounding advantage.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Target,
    title: "Complete your Readiness Check",
    body: "Answer 20 questions in 5 minutes. BidIQ Pro produces a scored readiness report and a prioritised action plan your team can act on immediately.",
  },
  {
    step: "02",
    icon: Search,
    title: "Receive matched tender alerts",
    body: "Daily alerts matched to your sectors, geography and capabilities — from Find a Tender, Contracts Finder, NHS Supply Chain and 200+ buyer portals.",
  },
  {
    step: "03",
    icon: Bot,
    title: "Write stronger bids with AI",
    body: "Upload the tender pack, answer guided questions and let AI draft compliant, high-scoring responses. Review, refine and submit. The heavy lifting is done.",
  },
  {
    step: "04",
    icon: RefreshCw,
    title: "Deliver, evidence and renew",
    body: "Track KPIs, capture evidence, build your reference library and stay ahead of renewals — creating compounding competitive advantage with every contract.",
  },
]

const COMPARISON = [
  { feature: "Live tender alerts",           old: true,  bidiq: true  },
  { feature: "AI opportunity fit scoring",   old: false, bidiq: true  },
  { feature: "Compliance gap detection",     old: false, bidiq: true  },
  { feature: "AI bid drafting",              old: false, bidiq: true  },
  { feature: "Readiness score & action plan",old: false, bidiq: true  },
  { feature: "Compliance vault & alerts",    old: false, bidiq: true  },
  { feature: "Bid pipeline CRM",             old: false, bidiq: true  },
  { feature: "Contract delivery tracking",   old: false, bidiq: true  },
  { feature: "Evidence collection",          old: false, bidiq: true  },
  { feature: "Win/loss learning",            old: false, bidiq: true  },
]

const HIGHWAYS_CATEGORIES = [
  "Road maintenance & resurfacing",
  "Drainage & gully emptying",
  "Line marking & road studs",
  "Winter maintenance & gritting",
  "Bridge works & structures",
  "Electrical & street lighting",
  "Traffic management & TM",
  "StreetWorks & utilities coordination",
]

const SECTOR_ICONS = [
  { icon: Construction, label: "Highways & Infra" },
  { icon: Heart,        label: "NHS & Health" },
  { icon: Building2,    label: "Local Authority" },
  { icon: GraduationCap,label: "Education" },
  { icon: Truck,        label: "Logistics & FM" },
  { icon: Wifi,         label: "Digital & IT" },
  { icon: Users,        label: "Social Care" },
  { icon: Zap,          label: "Energy & Utilities" },
]

const FEATURES_GRID = [
  { icon: Search,       title: "Tender Discovery",           badge: null },
  { icon: Target,       title: "Readiness Centre",           badge: "New" },
  { icon: Bot,          title: "AI Bid Workspace",           badge: null },
  { icon: Lock,         title: "Compliance Vault",           badge: null },
  { icon: Layers,       title: "Bid Pipeline CRM",           badge: null },
  { icon: Award,        title: "Contract Delivery",          badge: null },
  { icon: Building2,    title: "Buyer Intelligence",         badge: "Pro" },
  { icon: Users,        title: "Consortium Builder",         badge: "Pro" },
  { icon: Globe,        title: "Social Value Generator",     badge: "Pro" },
  { icon: BarChart3,    title: "Market Intelligence",        badge: "Pro" },
  { icon: BookOpen,     title: "Procurement Academy",        badge: "Pro" },
  { icon: PoundSterling,title: "Finance & Pricing Tools",    badge: "Growth" },
]

const TESTIMONIALS = [
  {
    quote: "BidIQ Pro found us a National Highways maintenance contract we'd have completely missed. We won it on our first attempt.",
    name: "James T.",
    role: "Director",
    company: "Highways maintenance contractor",
    stars: 5,
    avatar: "JT",
  },
  {
    quote: "The Compliance Vault alone is worth the subscription. No more panicking about expired insurances the night before a deadline.",
    name: "Priya S.",
    role: "Operations Manager",
    company: "Facilities management company",
    stars: 5,
    avatar: "PS",
  },
  {
    quote: "We went from a 12% win rate to over 40% in eight months. The AI bid workspace has transformed how we respond to tenders.",
    name: "Mark W.",
    role: "Managing Director",
    company: "Construction SME",
    stars: 5,
    avatar: "MW",
  },
]

const FAQS = [
  {
    q: "Is BidIQ Pro right for the size of my business?",
    a: "BidIQ Pro is built for companies with 5 to 200 employees bidding on contracts valued between £50,000 and £5 million. Whether you're submitting your first public sector tender or managing 20 bids a year, the platform scales with you.",
  },
  {
    q: "Do I need procurement experience to use BidIQ Pro?",
    a: "No prior expertise is needed. BidIQ Pro guides you through every step — from understanding the regulations to writing compliant bid answers. The Procurement Academy module provides structured learning to build your team's capability over time.",
  },
  {
    q: "What types of contracts can I find through BidIQ Pro?",
    a: "BidIQ Pro monitors opportunities across central government, local authorities, NHS trusts, housing associations, educational institutions, and highways and infrastructure frameworks including National Highways, regional DPS and framework agreements.",
  },
  {
    q: "How does the AI bid writing work?",
    a: "Upload the tender document pack and BidIQ Pro's AI extracts each question, identifies likely scoring criteria and produces a first-draft answer tailored to your company profile. You review, edit and improve the draft — the AI handles the time-consuming scaffolding so your team can focus on quality and strategy.",
  },
  {
    q: "Can I try BidIQ Pro before committing to a subscription?",
    a: "Yes. Every plan starts with a 14-day free trial. No credit card is required and there is no setup fee. You can complete the Readiness Check and explore matched tender alerts from day one.",
  },
  {
    q: "Is my company data secure?",
    a: "BidIQ Pro operates to ISO 27001-aligned information security processes. All data is hosted on UK-based infrastructure, encrypted in transit and at rest. We never share, sell or train AI models on your bid content or company information.",
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  HERO                                                             ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="relative overflow-hidden bg-noise" style={{ background: "linear-gradient(150deg, #0a1628 0%, #0f1f38 35%, #1a2e52 65%, #1a3a6b 100%)" }}>

        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-govgreen-600/8 blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-20 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-3xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-govgreen-600/6 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "72px 72px"
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8 lg:pt-28">

          {/* Headline block */}
          <motion.div
            className="text-center max-w-4xl mx-auto mb-14"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Eyebrow pill */}
            <motion.div variants={staggerItem} className="mb-5 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-govgreen-500/30 bg-govgreen-600/15 px-4 py-1.5 text-sm font-medium text-govgreen-300 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                The AI Procurement Operating System for SMEs
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={staggerItem}
              className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black leading-[1.1] tracking-tight text-white mb-6"
            >
              Win bigger public-sector contracts{" "}
              <span className="relative inline-block">
                <span className="text-govgreen-400">without a full bid team.</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-govgreen-400/60 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={staggerItem}
              className="text-lg lg:text-xl text-blue-100/70 leading-relaxed mb-8 max-w-3xl mx-auto"
            >
              BidIQ Pro helps SMEs discover live government tenders, check eligibility,
              prepare compliance, write stronger bids with AI, and manage contracts from
              opportunity to renewal — in one integrated platform.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-3 justify-center mb-4"
            >
              <Link to={ROUTES.register}>
                <Button
                  size="lg"
                  className="rounded-full bg-govgreen-600 hover:bg-govgreen-500 text-white font-bold px-8 h-12 text-base shadow-green transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] w-full sm:w-auto"
                >
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to={ROUTES.tenders}>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 text-white hover:bg-white/10 hover:border-white/40 px-8 h-12 text-base backdrop-blur-sm transition-all duration-200 w-full sm:w-auto"
                >
                  View Live Tender Feed
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={staggerItem} className="flex justify-center mb-6">
              <Link
                to={ROUTES.register}
                className="text-sm text-govgreen-300 hover:text-govgreen-200 underline underline-offset-2 transition-colors"
              >
                Or start with a free Readiness Check →
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={staggerItem} className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["JT", "PS", "MW", "AR", "SB"].map((init, i) => (
                    <div
                      key={init}
                      className="h-8 w-8 rounded-full bg-navy-700 border-2 border-navy-900 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ zIndex: 5 - i }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-blue-200/60">
                  Trusted by <span className="text-white font-semibold">500+</span> SMEs across highways, NHS & local authority
                </p>
              </div>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-blue-200/60 ml-2">4.9/5 across 200+ reviews</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {[
              { icon: Award,     label: "National Highways SME Gateway" },
              { icon: Heart,     label: "NHS Supply Chain Ready" },
              { icon: Shield,    label: "Crown Commercial Service Aligned" },
              { icon: FileCheck, label: "Find a Tender & Contracts Finder" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-blue-100/70 backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-govgreen-400 shrink-0" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="px-0 lg:px-8"
          >
            <DashboardMockup />
          </motion.div>

          {/* Journey steps */}
          <motion.div
            className="mt-10 pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <p className="text-center text-[10px] uppercase tracking-widest text-blue-300/40 mb-5 font-semibold">
              The complete procurement journey
            </p>
            <div className="flex flex-wrap justify-center gap-0 max-w-3xl mx-auto">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center px-1">
                    <div className={`h-1.5 w-1.5 rounded-full mb-1.5 ${
                      i === 0 ? "bg-govgreen-400 scale-150" :
                      i === 4 ? "bg-govgreen-400" :
                      "bg-blue-400/30"
                    }`} />
                    <span className={`text-[11px] font-semibold ${
                      i === 0 || i === 4 ? "text-govgreen-300" : "text-blue-200/35"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div className="h-px w-5 sm:w-8 bg-white/10 mx-0.5 mb-1" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="flex justify-center pb-6">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-blue-300/30"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  STATS BAR                                                        ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <AnimatedStat key={label} value={value} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  DATA SOURCES TRUST BAR                                           ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Live data sourced from
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                "Contracts Finder",
                "Find a Tender",
                "NHS Supply Chain",
                "National Highways",
                "Sell2Wales",
                "Public Contracts Scotland",
              ].map((source) => (
                <div key={source} className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-govgreen-500" />
                  {source}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  PROBLEM                                                          ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad bg-white">
        <div className="section-inner">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-red-50 text-red-600 border border-red-100 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              The Problem
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight mb-4">
              Public sector contracts are worth billions.{" "}
              <span className="text-red-500">Most SMEs miss out.</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              The UK government spends over £300 billion a year on public procurement.
              Less than 25% goes to SMEs — not because they can't do the work, but because
              the process is stacked against organisations without dedicated bid teams.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            {PAIN_POINTS.map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={staggerItem}>
                <Card className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/80 to-white shadow-sm hover:shadow-card-hover transition-all duration-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="shrink-0 h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900 mb-2 leading-snug">{title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  SOLUTION                                                         ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad bg-navy-50">
        <div className="section-inner">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-govgreen-50 text-govgreen-700 border border-govgreen-200 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              The Solution
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight mb-4">
              Everything a full procurement team has —{" "}
              <span className="text-govgreen-600">built into one platform.</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              One integrated AI operating system that replaces expensive bid consultants,
              fragmented spreadsheets and missed opportunities.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            {SOLUTION_FEATURES.map(({ icon: Icon, title, body, color, bg, border }) => (
              <motion.div key={title} variants={staggerItem}>
                <Card className={`rounded-2xl border ${border} bg-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 h-full group`}>
                  <CardContent className="p-6">
                    <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <h3 className="font-bold text-navy-900 text-base mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  COMPARISON                                                       ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad bg-white">
        <div className="section-inner">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-navy-50 text-navy-700 border border-navy-200 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              Why BidIQ Pro
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight mb-4">
              Not just a tender alert service.{" "}
              <span className="text-govgreen-600">An entire bid operation.</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              Traditional tender alert platforms show you opportunities. BidIQ Pro helps
              you find, qualify, prepare, bid, win, deliver and scale.
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={scaleIn}
          >
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-card-hover">
              {/* Header */}
              <div className="grid grid-cols-3 bg-navy-900">
                <div className="py-4 px-5 text-sm font-semibold text-blue-200/60">Capability</div>
                <div className="py-4 px-5 text-center text-sm font-semibold text-blue-200/60 border-l border-white/10">
                  Traditional alerts
                </div>
                <div className="py-4 px-5 text-center border-l border-white/10">
                  <span className="text-sm font-bold text-white">BidIQ Pro</span>
                  <span className="ml-1.5 text-[10px] text-govgreen-400 font-semibold bg-govgreen-400/15 px-1.5 py-0.5 rounded-full">AI</span>
                </div>
              </div>

              {COMPARISON.map(({ feature, old, bidiq }, i) => (
                <div
                  key={feature}
                  className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} border-t border-gray-100`}
                >
                  <div className="py-3 px-5 text-sm text-navy-800 font-medium">{feature}</div>
                  <div className="py-3 px-5 flex justify-center items-center border-l border-gray-100">
                    {old
                      ? <CheckCircle2 className="h-4 w-4 text-govgreen-500" />
                      : <X className="h-4 w-4 text-slate-300" />
                    }
                  </div>
                  <div className="py-3 px-5 flex justify-center items-center border-l border-gray-100">
                    <CheckCircle2 className="h-4 w-4 text-govgreen-600" />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 bg-govgreen-50 border-t-2 border-govgreen-200">
                <div className="py-4 px-5 text-sm font-bold text-navy-900">Outcome</div>
                <div className="py-4 px-5 text-center text-sm text-gray-500 border-l border-gray-100">
                  See opportunities
                </div>
                <div className="py-4 px-5 text-center border-l border-govgreen-200">
                  <span className="text-sm font-bold text-govgreen-700">Win contracts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  HOW IT WORKS                                                     ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section id="how-it-works" className="section-pad bg-navy-50">
        <div className="section-inner">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              How It Works
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight">
              From first check to first contract win —{" "}
              <span className="text-blue-600">in four steps.</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, body }, i) => (
              <motion.div key={step} variants={staggerItem} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:flex absolute top-7 left-[calc(100%-12px)] items-center z-10">
                    <div className="h-px w-6 bg-navy-200" />
                    <ChevronRight className="h-3 w-3 text-navy-300 -ml-1" />
                  </div>
                )}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-navy-900 text-white font-black text-lg flex items-center justify-center shadow-navy shrink-0">
                      {step}
                    </div>
                    <Icon className="h-4 w-4 text-govgreen-600" />
                  </div>
                  <h3 className="font-bold text-navy-900 text-base mb-2 leading-snug">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Link to={ROUTES.register}>
              <Button
                size="lg"
                className="rounded-full bg-navy-900 hover:bg-navy-800 text-white font-semibold px-8 h-12 text-base shadow-navy transition-all duration-200 hover:scale-[1.02]"
              >
                Start Your Free Readiness Check
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-sm text-gray-400">5 minutes. No account required to begin.</p>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  MARKET OPPORTUNITY (INVESTOR-STYLE STATS)                        ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad" style={{ background: "linear-gradient(135deg, #0f1f38 0%, #1e3055 100%)" }}>
        <div className="section-inner">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <Badge className="bg-govgreen-600/20 text-govgreen-300 border border-govgreen-500/30 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
                Market Opportunity
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-6">
                A £300bn market that{" "}
                <span className="text-govgreen-400">most SMEs can't access yet.</span>
              </h2>
              <p className="text-blue-100/70 leading-relaxed mb-6 text-lg">
                UK public procurement is the largest addressable market for growing SMEs —
                and it's legally required to be open to small businesses. The barrier isn't
                eligibility. It's the lack of a proper procurement operation.
              </p>
              <div className="space-y-3">
                {[
                  "£300bn+ in annual UK public sector contracts",
                  "25% legally ring-fenced for SMEs under the Procurement Act 2023",
                  "Over 12,000 new tenders published every month",
                  "Average contract value: £280,000 — achievable for most SMEs",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-govgreen-400 shrink-0 mt-0.5" />
                    <span className="text-blue-100/80 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "£300bn+", label: "Annual UK procurement spend", colour: "#4ade80" },
                { value: "25%",     label: "Reserved for SMEs by law",   colour: "#60a5fa" },
                { value: "12,000+", label: "New tenders per month",      colour: "#a78bfa" },
                { value: "£280k",   label: "Average contract value",     colour: "#fb923c" },
              ].map(({ value, label, colour }) => (
                <div
                  key={label}
                  className="rounded-2xl p-6 border border-white/10 text-center"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div className="text-3xl font-black mb-2" style={{ color: colour }}>{value}</div>
                  <div className="text-sm text-blue-200/60 leading-tight">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  HIGHWAYS SPECIALISM                                              ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad bg-navy-950 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-96 w-96 bg-govgreen-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative section-inner">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0 }}
              variants={fadeUp}
            >
              <Badge className="bg-govgreen-600/20 text-govgreen-300 border border-govgreen-500/30 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
                Sector Specialism
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-5">
                Built for highways, construction{" "}
                <span className="text-govgreen-400">and infrastructure SMEs.</span>
              </h2>
              <p className="text-blue-100/70 leading-relaxed mb-6 text-lg">
                BidIQ Pro understands the frameworks, qualification requirements and
                evaluation criteria used by National Highways, local authority highways
                teams and StreetWorks authorities. From NHSF regional frameworks to
                multi-authority DPS agreements, we know the landscape you work in.
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 text-amber-300 rounded-full px-4 py-2 text-sm font-semibold">
                <Award className="h-4 w-4" />
                National Highways SME Gateway aligned
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0 }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-3"
            >
              {HIGHWAYS_CATEGORIES.map((cat) => (
                <motion.div
                  key={cat}
                  variants={staggerItem}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 hover:bg-white/8 hover:border-govgreen-500/30 transition-all duration-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-govgreen-400 shrink-0" />
                  <span className="text-sm text-blue-100/80">{cat}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <Separator className="bg-white/8 mb-12" />

          {/* Sector icons */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            <p className="text-center text-[10px] uppercase tracking-widest text-blue-300/40 mb-8 font-semibold">
              Covering every public sector category
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {SECTOR_ICONS.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-2 group cursor-default"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center group-hover:bg-govgreen-600/20 group-hover:border-govgreen-500/30 transition-all duration-200">
                    <Icon className="h-5 w-5 text-blue-200/50 group-hover:text-govgreen-300 transition-colors duration-200" />
                  </div>
                  <span className="text-[11px] text-blue-200/40 group-hover:text-blue-200/70 transition-colors">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  FEATURES GRID                                                    ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section id="features" className="section-pad bg-slate-50">
        <div className="section-inner">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-navy-100 text-navy-700 border border-navy-200 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              Platform Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight">
              Every tool you need to compete and win.
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              Twelve integrated modules covering every stage of the procurement lifecycle —
              from first alert to contract renewal.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            {FEATURES_GRID.map(({ icon: Icon, title, badge }) => (
              <motion.div key={title} variants={staggerItem}>
                <Card className="rounded-xl border border-gray-100 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 h-full">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-navy-900/6 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-navy-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-navy-900 text-sm">{title}</span>
                        {badge && (
                          <Badge className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                            badge === "New"    ? "bg-govgreen-100 text-govgreen-700 border-govgreen-200" :
                            badge === "Pro"    ? "bg-purple-100 text-purple-700 border-purple-200" :
                            "bg-blue-100 text-blue-700 border-blue-200"
                          }`}>
                            {badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  TESTIMONIALS                                                     ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad bg-white border-y border-gray-100">
        <div className="section-inner">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-navy-900">
              Trusted by SMEs winning bigger contracts
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            {TESTIMONIALS.map(({ quote, name, role, company, stars, avatar }) => (
              <motion.div key={name} variants={staggerItem}>
                <Card className="rounded-2xl border border-gray-100 bg-white shadow-card hover:shadow-card-hover transition-all duration-200 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-5 flex-1 italic">
                      "{quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center text-xs font-black text-white shrink-0">
                        {avatar}
                      </div>
                      <div>
                        <p className="font-bold text-navy-900 text-sm">{name}</p>
                        <p className="text-xs text-gray-400">{role} · {company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  PRICING                                                          ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section id="pricing" className="section-pad bg-slate-50">
        <div className="section-inner">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-govgreen-50 text-govgreen-700 border border-govgreen-200 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight">
              Transparent pricing. No hidden fees.
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
              14-day free trial on every plan. No setup fee. Cancel any time.
            </p>
            <div className="flex flex-wrap gap-5 justify-center mt-6">
              {["14-day free trial", "No setup fee", "No card required", "Cancel any time"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-govgreen-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            {PRICING.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem} className="flex">
                <div className={`relative rounded-2xl border flex flex-col w-full transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-navy-900 border-navy-800 shadow-navy scale-[1.03]"
                    : "bg-white border-gray-200 shadow-card hover:shadow-card-hover"
                }`}>
                  {plan.highlighted && plan.badge && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-govgreen-600 text-white border-0 px-4 py-1.5 text-xs font-bold rounded-full shadow-green">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-6">
                      <h3 className={`text-xl font-black mb-1 ${plan.highlighted ? "text-white" : "text-navy-900"}`}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black tracking-tight ${plan.highlighted ? "text-white" : "text-navy-900"}`}>
                          £{plan.price}
                        </span>
                        <span className={`text-sm ${plan.highlighted ? "text-blue-200/50" : "text-gray-400"}`}>
                          /{plan.period}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${plan.highlighted ? "text-blue-200/40" : "text-gray-400"}`}>
                        + VAT. Billed monthly.
                      </p>
                    </div>

                    <Separator className={`mb-6 ${plan.highlighted ? "bg-white/10" : "bg-gray-100"}`} />

                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-govgreen-400" : "text-govgreen-600"}`} />
                          <span className={`text-sm ${plan.highlighted ? "text-blue-100/80" : "text-gray-600"}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link to={plan.cta === "Book Demo" ? "#" : ROUTES.register}>
                      <Button
                        size="lg"
                        className={`w-full rounded-full font-bold text-base h-12 transition-all duration-200 hover:scale-[1.02] ${
                          plan.highlighted
                            ? "bg-govgreen-600 hover:bg-govgreen-500 text-white shadow-green"
                            : "bg-navy-900 hover:bg-navy-800 text-white"
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10 text-sm text-gray-400"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            Need multi-user or enterprise licensing?{" "}
            <a href="mailto:hello@bidiqpro.co.uk" className="text-navy-700 underline underline-offset-2 hover:text-govgreen-600 transition-colors">
              Contact us for custom pricing
            </a>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  FAQ                                                              ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 mb-4 px-3 py-1 rounded-full text-xs font-semibold">
              FAQ
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900 leading-tight">
              Common questions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-gray-200 rounded-xl px-5 shadow-card data-[state=open]:shadow-card-hover data-[state=open]:border-gray-300 transition-all duration-200"
                >
                  <AccordionTrigger className="text-left font-bold text-navy-900 py-5 hover:no-underline text-base">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 leading-relaxed pb-5 text-sm">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  FINAL CTA                                                        ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <section className="section-pad relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1f38 40%, #1e3055 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-govgreen-600/8 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="relative section-inner text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <Badge className="bg-govgreen-600/20 text-govgreen-300 border border-govgreen-500/30 mb-6 px-3 py-1 rounded-full text-xs font-semibold">
                Get Started Today — Free for 14 Days
              </Badge>
            </motion.div>

            <motion.h2
              variants={staggerItem}
              className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6 max-w-3xl mx-auto"
            >
              Ready to win more{" "}
              <span className="text-govgreen-400">public sector contracts?</span>
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="text-blue-100/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Join 500+ SMEs using BidIQ Pro to find, qualify for and win government
              contracts across highways, NHS, local authority and beyond. Start your
              free readiness check in 5 minutes.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to={ROUTES.register}>
                <Button
                  size="lg"
                  className="rounded-full bg-govgreen-600 hover:bg-govgreen-500 text-white font-bold px-10 h-13 text-base shadow-green transition-all duration-200 hover:scale-[1.02]"
                >
                  Start Your Free Readiness Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/8 hover:border-white/35 px-10 h-13 text-base backdrop-blur-sm transition-all duration-200"
              >
                Book a 30-Minute Demo
              </Button>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="flex flex-wrap gap-5 justify-center mt-10 text-sm text-blue-200/50"
            >
              {["14-day free trial", "No card required", "No setup fee", "UK-hosted & secure"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-govgreen-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════════════╗
          ║  FOOTER                                                           ║
          ╚═══════════════════════════════════════════════════════════════════╝ */}
      <footer className="bg-navy-950 border-t border-white/5">
        <div className="section-inner py-14">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <Logo size="md" variant="full" white />
              <p className="text-sm text-blue-200/50 leading-relaxed max-w-xs">
                The AI Procurement Operating System for SMEs. Find, qualify for,
                bid on and win UK public sector contracts.
              </p>
              <p className="text-xs text-blue-200/30">
                © 2026 Civic Ladder Ltd. Registered in England & Wales.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-blue-200/50">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to={ROUTES.onboarding} className="hover:text-white transition-colors">Readiness Check</Link></li>
                <li><Link to={ROUTES.tenders} className="hover:text-white transition-colors">Live Tender Feed</Link></li>
                <li><Link to={ROUTES.academy} className="hover:text-white transition-colors">Procurement Academy</Link></li>
              </ul>
            </div>

            {/* Sectors */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Sectors</h4>
              <ul className="space-y-2.5 text-sm text-blue-200/50">
                <li className="hover:text-white/70 transition-colors cursor-default">Highways & National Highways</li>
                <li className="hover:text-white/70 transition-colors cursor-default">Local Authority</li>
                <li className="hover:text-white/70 transition-colors cursor-default">NHS & Health</li>
                <li className="hover:text-white/70 transition-colors cursor-default">Housing Associations</li>
                <li className="hover:text-white/70 transition-colors cursor-default">Education</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-blue-200/50">
                <li><a href="#" className="hover:text-white transition-colors">About Civic Ladder Ltd</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="mailto:hello@bidiqpro.co.uk" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-white/6 mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-blue-200/30 text-center sm:text-left">
              BidIQ Pro is not affiliated with or endorsed by any government department, NHS body or Crown Commercial Service.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-200/30">
              <div className="h-1.5 w-1.5 rounded-full bg-govgreen-500" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
