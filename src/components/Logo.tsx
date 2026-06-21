import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon"
  white?: boolean
}

// Sizes for the icon portion
const ICON_SIZES = { sm: 28, md: 36, lg: 48, xl: 64 }

const TEXT_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
}

export default function Logo({ className, size = "md", variant = "full", white = false }: LogoProps) {
  const iconSize = ICON_SIZES[size]

  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <BrandIcon size={size} white={white} />
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-black tracking-tight", TEXT_SIZES[size], white ? "text-white" : "text-navy-900")}>
            BidIQ<span className={white ? "text-govgreen-400" : "text-govgreen-600"}> Pro</span>
          </span>
          {size !== "sm" && (
            <span className={cn("text-[10px] tracking-wide mt-0.5", white ? "text-white/50" : "text-slate-400")}>
              by Civic Ladder Ltd
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── BrandIcon ─────────────────────────────────────────────────────────────────
// Uses the approved PNG icon if available, falls back to inline SVG
export function BrandIcon({ size = "md", white = false, className }: { size?: "sm" | "md" | "lg" | "xl"; white?: boolean; className?: string }) {
  const px = ICON_SIZES[size]
  return (
    <img
      src="/brand/bidiq-pro-icon.png"
      alt="BidIQ Pro"
      width={px}
      height={px}
      className={cn("object-contain shrink-0", className)}
      style={{ width: px, height: px }}
      onError={(e) => {
        // Fall back to inline SVG if PNG not found
        const target = e.currentTarget
        target.style.display = "none"
        const svg = target.nextElementSibling as SVGElement
        if (svg) svg.style.display = "block"
      }}
    />
  )
}

// ─── BrandLogo ─────────────────────────────────────────────────────────────────
// Full horizontal logo using PNG, falls back to text+icon combo
export function BrandLogo({
  className,
  size = "md",
  white = false,
}: {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  white?: boolean
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/brand/bidiq-pro-logo.png"
        alt="BidIQ Pro"
        className="object-contain"
        style={{ height: ICON_SIZES[size], maxWidth: ICON_SIZES[size] * 4 }}
        onError={(e) => {
          // Fall back to Logo component behaviour
          const target = e.currentTarget
          target.style.display = "none"
          const fallback = target.nextElementSibling as HTMLElement
          if (fallback) fallback.style.display = "flex"
        }}
      />
      {/* Fallback hidden by default */}
      <Logo size={size} variant="full" white={white} className="hidden" />
    </div>
  )
}

// ─── LogoWhite ─────────────────────────────────────────────────────────────────
// Convenience wrapper for white variant (used in dark sidebars/footers)
export function LogoWhite({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  return <Logo className={className} size={size} variant="full" white />
}
