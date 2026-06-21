import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = "GBP"): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}m`
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}k`
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function scoreColor(score: number): "green" | "amber" | "red" {
  if (score >= 70) return "green"
  if (score >= 40) return "amber"
  return "red"
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 65) return "Good"
  if (score >= 45) return "Developing"
  if (score >= 25) return "Needs Work"
  return "Critical"
}

export function riskColor(level: "low" | "medium" | "high"): string {
  return level === "low" ? "text-govgreen-700" : level === "medium" ? "text-amber-700" : "text-red-700"
}

export function statusIcon(status: "green" | "amber" | "red"): string {
  return status === "green" ? "✓" : status === "amber" ? "!" : "✗"
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str
}
