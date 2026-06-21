import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  TrendingUp,
  FileText,
  Search,
  Award,
  ChevronDown,
  Star,
  Building2,
  Construction,
  Truck,
  Heart,
  GraduationCap,
  Wifi,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { PRICING, ROUTES } from "@/lib/constants"

// ─── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

// ─── Data ──────────────────────────────────────────────────────────────────
const JOURNEY_STEPS = [
  "Find",
  "Qualify",
  "Prepare",
  "Bid",
  "Win",
  "Deliver",
  "Renew",
  "Scale",
]

const STATS = [
  { value: "£2.3bn+", label: "in matched opportunities" },
  { value: "72%", label: "average readiness improvement" },
  { value: "34%", label: "win rate uplift" },
  { value: "500+", label: "SMEs using BidIQ Pro" },
]

const PAIN_POINTS = [
  {
    icon: Search,
    title: "You don't know which contracts you're eligible for",
    body: "Thousands of notices are published every week across Find a Tender, Contracts Finder and buyer portals. Without intelligent filtering, the right ones slip past you every time.",
  },
  {
    icon: FileText,
    title: "Bid documents are complex and time-consuming",
    body: "Writing compliant, compelling answers to method statements, social value questions and pricing schedules can take weeks — time most SME teams simply don't have.",
  },
  {
    icon: Shield,
    title: "You're missing compliance documents at the wrong moment",
    body: "Expired insurance certificates, lapsed ISO accreditations or missing policies disqualify you from bids you could easily win. Most SMEs only find out after submission.",
  },
  {
    icon: TrendingUp,
    title: "You have no visibility on deadlines, renewals or pipeline",
    body: "Without a structured bid pipeline, contracts renew or expire without your knowledge and opportunities are lost to better-organised competitors.",
  },
]

const SOLUTION_FEATURES = [
  {
    icon: Search,
    title: "AI Tender Discovery",
    body: "Matches live public sector opportunities to your capabilities, sectors and geography — before your competitors even know they exist.",
    color: "text-govgreen-600",
    bg: "bg-govgreen-50",
  },
  {
    icon: CheckCircle2,
    title: "Readiness Assessment",
    body: "A 5-minute diagnostic that identifies every compliance gap, missing document and capability shortfall blocking your next win.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "AI Bid Workspace",
    body: "Upload the tender pack. The AI extracts questions, suggests scoring criteria and drafts high-quality answers you refine and submit.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Shield,
    title: "Compliance Vault",
    body: "Store, track and auto-remind every certificate, policy and accreditation with expiry alerts 90, 30 and 7 days in advance.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: TrendingUp,
    title: "Pipeline CRM",
    body: "Kanban-style bid management across every stage — from spotted opportunity to post-award debrief — with team task assignments and deadline calendars.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Award,
    title: "Contract Delivery Hub",
    body: "Structured KPI tracking, evidence capture and renewal preparation that turns good delivery into the next winning bid.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: CheckCircle2,
    title: "Complete your Readiness Check",
    body: "Answer 20 questions in 5 minutes. BidIQ Pro produces a scored readiness report and a prioritised action plan.",
    cta: null,
  },
  {
    step: "02",
    icon: Search,
    title: "Discover matched opportunities",
    body: "Receive daily matched tender alerts from Find a Tender, Contracts Finder, NHS Supply Chain and 200+ buyer portals — filtered to contracts you can actually win.",
    cta: null,
  },
  {
    step: "03",
    icon: FileText,
    title: "Write and submit winning bids with AI",
    body: "Upload the tender pack, answer guided questions and let the AI draft compliant, high-scoring responses. Human review stays central — AI does the heavy lifting.",
    cta: null,
  },
  {
    step: "04",
    icon: Award,
    title: "Deliver contracts and win renewals",
    body: "Track KPIs, capture evidence, build your reference library and get ahead of contract renewals — creating a compounding competitive advantage over time.",
    cta: null,
  },
]

const HIGHWAYS_CATEGORIES = [
  "Road maintenance & resurfacing",
  "Drainage & gully emptying",
  "Line marking & road studs",
  "Winter maintenance & gritting",
  "Bridge works & structures",
  "Electrical & street lighting",
  "Traffic management",
  "StreetWorks & utilities coordination",
]

const SECTOR_ICONS = [
  { icon: Construction, label: "Highways & Infra" },
  { icon: Heart, label: "NHS & Health" },
  { icon: Building2, label: "Local Authority" },
  { icon: GraduationCap, label: "Education" },
  { icon: Truck, label: "Logistics & FM" },
  { icon: Wifi, label: "Digital & IT" },
  { icon: Users, label: "Social Care" },
  { icon: Zap, label: "Energy & Utilities" },
]

const FEATURES_GRID = [
  { icon: Search, title: "Tender Discovery", badge: null },
  { icon: CheckCircle2, title: "Readiness Centre", badge: "New" },
  { icon: FileText, title: "AI Bid Workspace", badge: null },
  { icon: Shield, title: "Compliance Vault", badge: null },
  { icon: TrendingUp, title: "Bid Pipeline CRM", badge: null },
  { icon: Award, title: "Contract Delivery", badge: null },
  { icon: Building2, title: "Buyer Intelligence", badge: "Pro" },
  { icon: Users, title: "Consortium Builder", badge: "Pro" },
  { icon: Star, title: "Social Value Generator", badge: "Pro" },
  { icon: Zap, title: "Market Intelligence", badge: "Pro" },
  { icon: GraduationCap, title: "Procurement Academy", badge: "Pro" },
  { icon: TrendingUp, title: "Finance & Pricing Tools", badge: "Growth" },
]

const FAQS = [
  {
    q: "Is BidIQ Pro suitable for my size of business?",
    a: "BidIQ Pro is designed for companies with 5 to 200 employees that are bidding for contracts valued between £50,000 and £5 million. Whether you're submitting your first public sector tender or managing 20 bids a year, the platform scales with you.",
  },
  {
    q: "Do I need procurement experience to use BidIQ Pro?",
    a: "No prior procurement expertise is needed. BidIQ Pro guides you through every step — from understanding the regulations to writing compliant bid answers. The Procurement Academy module also provides structured learning to build your team's capability over time.",
  },
  {
    q: "What types of contracts can I find through BidIQ Pro?",
    a: "BidIQ Pro monitors opportunities across central government, local authorities, NHS trusts and integrated care boards, housing associations, educational institutions, and highways and infrastructure frameworks including National Highways, regional authority DPS and framework agreements.",
  },
  {
    q: "How does the AI bid writing work?",
    a: "Upload the tender document pack and BidIQ Pro's AI extracts each question, identifies likely scoring criteria and produces a first-draft answer tailored to your company profile. You review, edit and improve the draft — the AI handles the time-consuming scaffolding so your team can focus on quality and strategy.",
  },
  {
    q: "Can I try BidIQ Pro before committing to a subscription?",
    a: "Yes. Every plan starts with a 14-day free trial. No credit card is required to begin and there is no setup fee. You can complete the Readiness Check and explore matched tender alerts from day one.",
  },
  {
    q: "Is my company data secure?",
    a: "BidIQ Pro operates to ISO 27001-aligned information security processes. All data is hosted on UK-based infrastructure, encrypted in transit and at rest. We never share, sell or train AI models on your bid content or company information.",
  },
]

// ─── Component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-blue-900 text-white">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-govgreen-600/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Pre-headline badge */}
            <motion.div variants={staggerItem} className="mb-6">
              <Badge className="bg-govgreen-600/20 text-govgreen-300 border border-govgreen-500/30 px-4 py-1.5 text-sm font-medium rounded-full">
                The AI Procurement Operating System for SMEs
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={staggerItem}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Win bigger government contracts{" "}
              <span className="text-govgreen-400">without needing a full bid team.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={staggerItem}
              className="text-lg lg:text-xl text-blue-100/80 leading-relaxed mb-8 max-w-3xl mx-auto"
            >
              BidIQ Pro helps SMEs discover, qualify for, write, manage and win
              public-sector contracts using AI — putting enterprise-grade procurement
              capability in the hands of every growing business.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Link to={ROUTES.register}>
                <Button
                  size="lg"
                  className="rounded-full bg-govgreen-600 hover:bg-govgreen-500 text-white font-semibold px-8 py-6 text-base shadow-lg shadow-govgreen-900/30 transition-all duration-200"
                >
                  Start Readiness Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 text-base backdrop-blur-sm"
              >
                Book Demo
              </Button>
            </motion.div>

            {/* Social proof text */}
            <motion.p
              variants={staggerItem}
              className="text-blue-200/60 text-sm mb-8"
            >
              Trusted by 500+ SMEs across highways, NHS, local authority and education
            </motion.p>

            {/* Trust badges */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap mb-14"
            >
              {[
                { icon: Award, label: "National Highways Approved Categories" },
                { icon: Heart, label: "NHS Supply Chain Ready" },
                { icon: Shield, label: "Crown Commercial Service Aligned" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-2 text-sm text-blue-100/80 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 text-govgreen-400 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Journey steps */}
            <motion.div variants={staggerItem}>
              <p className="text-xs uppercase tracking-widest text-blue-300/50 mb-4 font-medium">
                Your procurement journey
              </p>
              <div className="flex flex-wrap justify-center gap-0">
                {JOURNEY_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-2 w-2 rounded-full mb-1 ${
                          i === 0
                            ? "bg-govgreen-400 scale-125"
                            : i === 4
                            ? "bg-govgreen-400"
                            : "bg-blue-400/40"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          i === 0 || i === 4
                            ? "text-govgreen-300"
                            : "text-blue-200/50"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < JOURNEY_STEPS.length - 1 && (
                      <div className="h-px w-8 bg-blue-400/20 mx-1 mb-1" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="relative flex justify-center pb-8">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-blue-300/40"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      <section className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {STATS.map(({ value, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {value}
                </div>
                <div className="text-sm text-blue-300/70">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROBLEM ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Badge className="bg-red-50 text-red-600 border border-red-100 mb-4 px-3 py-1 rounded-full text-sm">
              The Problem
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
              Public sector contracts are worth billions —{" "}
              <span className="text-red-500">but most SMEs miss out</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              The UK government spends over £300 billion a year on public
              procurement. Less than 25% goes to SMEs — not because they can't
              do the work, but because the process is stacked against them.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {PAIN_POINTS.map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={staggerItem}>
                <Card className="rounded-xl border border-red-100 bg-red-50/40 shadow-sm hover:shadow-md transition-all duration-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900 mb-1 leading-snug">
                          {title}
                        </h3>
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

      {/* ── SOLUTION ───────────────────────────────────────────────────── */}
      <section className="bg-navy-50 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Badge className="bg-govgreen-50 text-govgreen-700 border border-govgreen-200 mb-4 px-3 py-1 rounded-full text-sm">
              The Solution
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
              BidIQ Pro gives you everything{" "}
              <span className="text-govgreen-600">a full procurement team would have</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              One integrated platform that replaces expensive consultants,
              fragmented spreadsheets and missed opportunities.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {SOLUTION_FEATURES.map(({ icon: Icon, title, body, color, bg }) => (
              <motion.div key={title} variants={staggerItem}>
                <Card className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 h-full group">
                  <CardContent className="p-6">
                    <div
                      className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <h3 className="font-semibold text-navy-900 text-base mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 mb-4 px-3 py-1 rounded-full text-sm">
              How It Works
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
              From first check to first contract win —{" "}
              <span className="text-blue-600">in four steps</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, body }, i) => (
              <motion.div key={step} variants={staggerItem} className="relative">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+0px)] w-6 h-px bg-gray-200 z-10" />
                )}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-navy-900 text-white font-bold text-lg mb-4 shadow-lg shadow-navy-900/20">
                    {step}
                  </div>
                  <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                    <Icon className="h-4 w-4 text-govgreen-600" />
                    <h3 className="font-semibold text-navy-900 text-base">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Link to={ROUTES.register}>
              <Button
                size="lg"
                className="rounded-full bg-navy-900 hover:bg-navy-800 text-white font-semibold px-8 py-6 text-base shadow-md"
              >
                Start Your Free Readiness Check
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              5 minutes. No account required to begin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HIGHWAYS FOCUS ─────────────────────────────────────────────── */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
          <div className="absolute top-0 right-0 h-96 w-96 bg-govgreen-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
            >
              <Badge className="bg-govgreen-600/20 text-govgreen-300 border border-govgreen-500/30 mb-4 px-3 py-1 rounded-full text-sm">
                Sector Specialism
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Built for highways, construction{" "}
                <span className="text-govgreen-400">and infrastructure SMEs</span>
              </h2>
              <p className="text-blue-100/70 leading-relaxed mb-6 text-lg">
                BidIQ Pro understands the frameworks, qualification requirements
                and evaluation criteria used by National Highways, Highways England,
                local authority highways teams and StreetWorks authorities. From
                NHSF regional frameworks to multi-authority DPS agreements, we
                know the landscape you work in.
              </p>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-full text-sm font-medium">
                <Award className="h-3.5 w-3.5 mr-1.5 inline" />
                National Highways SME Gateway aligned
              </Badge>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-3"
            >
              {HIGHWAYS_CATEGORIES.map((cat) => (
                <motion.div
                  key={cat}
                  variants={staggerItem}
                  className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-lg px-3 py-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-govgreen-400 flex-shrink-0" />
                  <span className="text-sm text-blue-100/80">{cat}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sector icons row */}
          <Separator className="mt-14 mb-10 bg-white/10" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <p className="text-center text-xs uppercase tracking-widest text-blue-300/40 mb-8 font-medium">
              Covering every public sector category
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {SECTOR_ICONS.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center group-hover:bg-govgreen-600/20 group-hover:border-govgreen-500/30 transition-all duration-200">
                    <Icon className="h-5 w-5 text-blue-200/60 group-hover:text-govgreen-300 transition-colors duration-200" />
                  </div>
                  <span className="text-xs text-blue-200/50">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────────── */}
      <section id="features" className="bg-navy-50 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Badge className="bg-navy-100 text-navy-700 border border-navy-200 mb-4 px-3 py-1 rounded-full text-sm">
              Platform Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
              Everything you need to compete and win
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Twelve integrated modules covering every stage of the procurement
              lifecycle — from first alert to contract renewal.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {FEATURES_GRID.map(({ icon: Icon, title, badge }) => (
              <motion.div key={title} variants={staggerItem}>
                <Card className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-navy-900/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-navy-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-navy-900 text-sm">{title}</span>
                        {badge && (
                          <Badge
                            className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                              badge === "New"
                                ? "bg-govgreen-100 text-govgreen-700 border-govgreen-200"
                                : badge === "Pro"
                                ? "bg-purple-100 text-purple-700 border-purple-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            } border`}
                          >
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

      {/* ── PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Badge className="bg-govgreen-50 text-govgreen-700 border border-govgreen-200 mb-4 px-3 py-1 rounded-full text-sm">
              Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
              Transparent pricing. No hidden fees.
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              14-day free trial on every plan. No setup fee. Cancel any time.
            </p>

            {/* Trial callouts */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              {["14-day free trial", "No setup fee", "No credit card required", "Cancel any time"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-govgreen-600 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {PRICING.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem} className="flex">
                <div
                  className={`relative rounded-2xl border flex flex-col w-full transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-navy-900 border-navy-900 shadow-2xl shadow-navy-900/30 scale-105"
                      : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Most popular badge */}
                  {plan.highlighted && plan.badge && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-govgreen-600 text-white border-0 px-4 py-1.5 text-sm font-semibold rounded-full shadow-lg">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {/* Plan name */}
                    <div className="mb-6">
                      <h3
                        className={`text-xl font-bold mb-1 ${
                          plan.highlighted ? "text-white" : "text-navy-900"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-4xl font-bold ${
                            plan.highlighted ? "text-white" : "text-navy-900"
                          }`}
                        >
                          £{plan.price}
                        </span>
                        <span
                          className={`text-sm ${
                            plan.highlighted ? "text-blue-200/60" : "text-gray-400"
                          }`}
                        >
                          /{plan.period}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          plan.highlighted ? "text-blue-200/50" : "text-gray-400"
                        }`}
                      >
                        + VAT. Billed monthly.
                      </p>
                    </div>

                    <Separator
                      className={`mb-6 ${
                        plan.highlighted ? "bg-white/10" : "bg-gray-100"
                      }`}
                    />

                    {/* Features */}
                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              plan.highlighted
                                ? "text-govgreen-400"
                                : "text-govgreen-600"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              plan.highlighted
                                ? "text-blue-100/80"
                                : "text-gray-600"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      to={plan.cta === "Book Demo" ? "#" : ROUTES.register}
                    >
                      <Button
                        size="lg"
                        className={`w-full rounded-full font-semibold text-base py-5 transition-all duration-200 ${
                          plan.highlighted
                            ? "bg-govgreen-600 hover:bg-govgreen-500 text-white shadow-lg"
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

          {/* Enterprise note */}
          <motion.div
            className="text-center mt-10 text-sm text-gray-400"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            Need a multi-user or enterprise licence?{" "}
            <a
              href="mailto:hello@bidiqpro.co.uk"
              className="text-navy-700 underline underline-offset-2 hover:text-govgreen-600 transition-colors"
            >
              Contact us for custom pricing
            </a>
            .
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ──────────────────────────────────────────── */}
      <section className="bg-navy-50 py-14 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                quote:
                  "BidIQ Pro found us a National Highways maintenance contract we'd have completely missed. We won it on our first attempt.",
                name: "James T.",
                role: "Director, highways maintenance contractor",
                stars: 5,
              },
              {
                quote:
                  "The Compliance Vault alone is worth the subscription. No more panicking about expired insurances the night before a deadline.",
                name: "Priya S.",
                role: "Operations Manager, FM company",
                stars: 5,
              },
              {
                quote:
                  "We went from a 12% win rate to over 40% in eight months. The AI bid workspace has transformed how we respond to tenders.",
                name: "Mark W.",
                role: "MD, construction SME",
                stars: 5,
              },
            ].map(({ quote, name, role, stars }) => (
              <motion.div key={name} variants={staggerItem}>
                <Card className="rounded-xl border border-gray-100 bg-white shadow-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                      "{quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-400">{role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 mb-4 px-3 py-1 rounded-full text-sm">
              FAQ
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
              Common questions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-gray-200 rounded-xl px-5 shadow-sm data-[state=open]:shadow-md transition-shadow duration-200"
                >
                  <AccordionTrigger className="text-left font-semibold text-navy-900 py-5 hover:no-underline text-base">
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

      {/* ── BOOK DEMO CTA ──────────────────────────────────────────────── */}
      <section className="bg-navy-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-govgreen-600/8 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <Badge className="bg-govgreen-600/20 text-govgreen-300 border border-govgreen-500/30 mb-6 px-3 py-1 rounded-full text-sm">
                Get Started Today
              </Badge>
            </motion.div>

            <motion.h2
              variants={staggerItem}
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6 max-w-3xl mx-auto"
            >
              Ready to win more{" "}
              <span className="text-govgreen-400">public sector contracts?</span>
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="text-blue-100/70 text-lg max-w-2xl mx-auto mb-10"
            >
              Join 500+ SMEs using BidIQ Pro to find, qualify for and win
              government contracts across highways, NHS, local authority and
              beyond. Start your free readiness check in 5 minutes.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to={ROUTES.register}>
                <Button
                  size="lg"
                  className="rounded-full bg-govgreen-600 hover:bg-govgreen-500 text-white font-semibold px-10 py-6 text-base shadow-lg shadow-govgreen-900/30"
                >
                  Start Your Free Readiness Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 text-white hover:bg-white/8 hover:border-white/40 px-10 py-6 text-base backdrop-blur-sm"
              >
                Book a 30-Minute Demo
              </Button>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="flex flex-wrap gap-5 justify-center mt-10 text-sm text-blue-200/50"
            >
              {[
                "14-day free trial",
                "No card required",
                "No setup fee",
                "UK-hosted & secure",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-govgreen-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-navy-950 border-t border-white/5 text-blue-200/40 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold text-white/60 mb-0.5">BidIQ Pro</p>
              <p className="text-xs">
                A product of Civic Ladder Ltd. Registered in England & Wales.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-xs justify-center">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Security",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-white/60 transition-colors duration-150"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <Separator className="my-6 bg-white/5" />
          <p className="text-xs text-center">
            © {new Date().getFullYear()} Civic Ladder Ltd. All rights reserved.
            BidIQ Pro is not affiliated with or endorsed by any government
            department, NHS body or Crown Commercial Service.
          </p>
        </div>
      </footer>

    </div>
  )
}
