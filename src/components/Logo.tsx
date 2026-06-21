import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
}

export default function Logo({ className, size = "md", variant = "full" }: LogoProps) {
  const sizes = { sm: 24, md: 32, lg: 48 }
  const iconSize = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BidIQ Pro logo"
      >
        <rect width="40" height="40" rx="8" fill="#1e3055" />
        {/* Bold B */}
        <text x="6" y="28" fontFamily="Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="white">B</text>
        {/* Upward arrow */}
        <path d="M29 18 L33 13 L37 18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="33" y1="13" x2="33" y2="26" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Checkmark */}
        <path d="M28 30 L31 33 L37 26" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-black text-navy-900", {
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-xl": size === "lg",
          })}>
            BidIQ<span className="text-govgreen-600"> Pro</span>
          </span>
          {size !== "sm" && (
            <span className="text-[10px] text-muted-foreground tracking-wide">by Civic Ladder Ltd</span>
          )}
        </div>
      )}
    </div>
  )
}

export function LogoWhite({ className, size = "md" }: Omit<LogoProps, "variant">) {
  const sizes = { sm: 24, md: 32, lg: 48 }
  const iconSize = sizes[size]
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="rgba(255,255,255,0.15)" />
        <text x="6" y="28" fontFamily="Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="white">B</text>
        <path d="M29 18 L33 13 L37 18" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="33" y1="13" x2="33" y2="26" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M28 30 L31 33 L37 26" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className={cn("font-black text-white", {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-xl": size === "lg",
        })}>
          BidIQ<span className="text-govgreen-400"> Pro</span>
        </span>
        {size !== "sm" && (
          <span className="text-[10px] text-white/60 tracking-wide">by Civic Ladder Ltd</span>
        )}
      </div>
    </div>
  )
}
