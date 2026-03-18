"use client"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-[14px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}
