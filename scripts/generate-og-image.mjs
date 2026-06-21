import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'fs'

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0f1f38"/>
      <stop offset="100%" stop-color="#0a1628"/>
    </linearGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Ambient glow -->
  <ellipse cx="960" cy="180" rx="340" ry="260" fill="rgba(34,197,94,0.07)"/>
  <ellipse cx="200" cy="500" rx="220" ry="160" fill="rgba(30,48,85,0.5)"/>

  <!-- Left accent bar -->
  <rect x="80" y="185" width="4" height="260" rx="2" fill="url(#green)"/>

  <!-- BidIQ wordmark -->
  <text x="108" y="300" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-weight="900" font-size="96" fill="#ffffff" letter-spacing="-4">BidIQ</text>
  <text x="108" y="385" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-weight="300" font-size="96" fill="rgba(255,255,255,0.45)" letter-spacing="-2">Pro</text>

  <!-- Tagline -->
  <text x="108" y="438" font-family="system-ui,-apple-system,sans-serif" font-weight="400" font-size="26" fill="rgba(255,255,255,0.6)">The AI Procurement Operating System for UK SMEs</text>

  <!-- Green badge -->
  <rect x="108" y="460" width="284" height="38" rx="19" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.35)" stroke-width="1.5"/>
  <text x="250" y="484" font-family="system-ui,-apple-system,sans-serif" font-weight="700" font-size="13" fill="#4ade80" text-anchor="middle" letter-spacing="1.5">WIN MORE PUBLIC CONTRACTS</text>

  <!-- CTA button -->
  <rect x="108" y="530" width="224" height="50" rx="10" fill="url(#green)"/>
  <text x="220" y="562" font-family="system-ui,-apple-system,sans-serif" font-weight="700" font-size="17" fill="#ffffff" text-anchor="middle">Start Free Today →</text>

  <!-- Right panel: browser chrome mockup -->
  <rect x="700" y="100" width="420" height="430" rx="16" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>

  <!-- Browser top bar -->
  <rect x="700" y="100" width="420" height="52" rx="16" fill="rgba(255,255,255,0.04)"/>
  <rect x="700" y="132" width="420" height="20" fill="rgba(255,255,255,0.04)"/>
  <circle cx="730" cy="126" r="7" fill="rgba(239,68,68,0.65)"/>
  <circle cx="750" cy="126" r="7" fill="rgba(250,189,47,0.65)"/>
  <circle cx="770" cy="126" r="7" fill="rgba(34,197,94,0.65)"/>
  <rect x="800" y="118" width="200" height="16" rx="8" fill="rgba(255,255,255,0.06)"/>
  <text x="900" y="130" font-family="system-ui,-apple-system,sans-serif" font-size="11" fill="rgba(255,255,255,0.3)" text-anchor="middle">bidiqpro.com/dashboard</text>

  <!-- Stat cards row -->
  <rect x="718" y="168" width="116" height="64" rx="8" fill="rgba(255,255,255,0.07)"/>
  <text x="776" y="196" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">£2.1m</text>
  <text x="776" y="216" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="rgba(255,255,255,0.45)" text-anchor="middle">Pipeline Value</text>

  <rect x="846" y="168" width="116" height="64" rx="8" fill="rgba(255,255,255,0.07)"/>
  <text x="904" y="196" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="800" fill="#4ade80" text-anchor="middle">84%</text>
  <text x="904" y="216" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="rgba(255,255,255,0.45)" text-anchor="middle">Compliance</text>

  <rect x="974" y="168" width="128" height="64" rx="8" fill="rgba(255,255,255,0.07)"/>
  <text x="1038" y="196" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">12</text>
  <text x="1038" y="216" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="rgba(255,255,255,0.45)" text-anchor="middle">Live Tenders</text>

  <!-- Bar chart area -->
  <rect x="718" y="248" width="384" height="110" rx="8" fill="rgba(255,255,255,0.035)"/>
  <text x="730" y="264" font-family="system-ui,-apple-system,sans-serif" font-size="10" font-weight="600" fill="rgba(255,255,255,0.4)">Tender Activity</text>
  <rect x="730" y="320" width="26" height="28" rx="3" fill="rgba(34,197,94,0.5)"/>
  <rect x="764" y="305" width="26" height="43" rx="3" fill="rgba(34,197,94,0.6)"/>
  <rect x="798" y="288" width="26" height="60" rx="3" fill="rgba(34,197,94,0.7)"/>
  <rect x="832" y="298" width="26" height="50" rx="3" fill="rgba(34,197,94,0.65)"/>
  <rect x="866" y="275" width="26" height="73" rx="3" fill="rgba(34,197,94,0.85)"/>
  <rect x="900" y="290" width="26" height="58" rx="3" fill="rgba(34,197,94,0.7)"/>
  <rect x="934" y="280" width="26" height="68" rx="3" fill="rgba(34,197,94,0.75)"/>
  <rect x="968" y="268" width="26" height="80" rx="3" fill="rgba(34,197,94,1.0)"/>
  <rect x="1002" y="278" width="26" height="70" rx="3" fill="rgba(34,197,94,0.8)"/>
  <rect x="1036" y="260" width="26" height="88" rx="3" fill="rgba(34,197,94,0.9)"/>
  <rect x="1070" y="272" width="26" height="76" rx="3" fill="rgba(34,197,94,0.75)"/>

  <!-- AI strip -->
  <rect x="718" y="374" width="384" height="40" rx="8" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" stroke-width="1"/>
  <circle cx="738" cy="394" r="8" fill="rgba(34,197,94,0.25)"/>
  <text x="752" y="399" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="500" fill="rgba(255,255,255,0.75)">AI: 3 high-match tenders found this week</text>

  <!-- Tender items -->
  <rect x="718" y="428" width="384" height="42" rx="8" fill="rgba(255,255,255,0.04)"/>
  <rect x="730" y="440" width="6" height="6" rx="1" fill="#4ade80"/>
  <text x="746" y="448" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" fill="rgba(255,255,255,0.85)">National Highways — M25 Improvement Works</text>
  <text x="746" y="463" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="rgba(255,255,255,0.4)">£450k · Closes 14 Jul · Match 94%</text>

  <rect x="718" y="477" width="384" height="42" rx="8" fill="rgba(255,255,255,0.025)"/>
  <rect x="730" y="489" width="6" height="6" rx="1" fill="#fbbf24"/>
  <text x="746" y="497" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" fill="rgba(255,255,255,0.7)">NHS — Digital Health Platform Services</text>
  <text x="746" y="512" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="rgba(255,255,255,0.35)">£120k · Closes 28 Jul · Match 87%</text>

  <!-- Domain stamp -->
  <text x="1190" y="618" font-family="system-ui,-apple-system,sans-serif" font-size="13" fill="rgba(255,255,255,0.25)" text-anchor="end">bidiqpro.com</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

writeFileSync('public/brand/bidiq-social-preview.png', pngBuffer)
console.log('Generated public/brand/bidiq-social-preview.png')
