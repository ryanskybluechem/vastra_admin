"use client"

import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/animated-number"
import { staggerChild } from "@/lib/animations"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  formatFn?: (n: number) => string
  subtitle?: string
  icon: LucideIcon
}

export function StatCard({ title, value, formatFn, subtitle, icon: Icon }: StatCardProps) {
  return (
    <motion.div variants={staggerChild} className="ios-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <AnimatedNumber value={value} formatFn={formatFn} className="text-[28px] font-bold tracking-tight leading-none" />
      {subtitle && <p className="text-[12px] font-medium mt-1.5 text-muted-foreground">{subtitle}</p>}
    </motion.div>
  )
}
