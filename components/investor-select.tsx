"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Investor {
  id: string
  name: string | null
  email: string
}

interface InvestorSelectProps {
  investors: Investor[]
  value: string
  onValueChange: (value: string | null) => void
  placeholder?: string
}

export function InvestorSelect({ investors, value, onValueChange, placeholder = "Select investor" }: InvestorSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {investors.map((inv) => (
          <SelectItem key={inv.id} value={inv.id}>
            {inv.name || inv.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
