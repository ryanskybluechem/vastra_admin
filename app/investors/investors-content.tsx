"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { formatCurrency } from "@/lib/format"
import { pageVariants } from "@/lib/animations"

interface Investor {
  id: string
  name: string
  email: string
  entity_name: string | null
  phone: string | null
  role: string
  created_at: string
  totalInvested: number
  investmentCount: number
  currentValue: number
}

interface InvestorsContentProps {
  investors: Investor[]
}

export function InvestorsContent({ investors }: InvestorsContentProps) {
  const router = useRouter()

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item: Investor) => <span className="font-semibold">{item.name}</span>,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "entity_name",
      label: "Entity",
      render: (item: Investor) => (
        <span className="text-muted-foreground">{item.entity_name || "--"}</span>
      ),
    },
    {
      key: "totalInvested",
      label: "Total Invested",
      searchable: false,
      render: (item: Investor) => (
        <span className="font-medium tabular-nums">{formatCurrency(item.totalInvested)}</span>
      ),
    },
    {
      key: "investmentCount",
      label: "# Investments",
      searchable: false,
      render: (item: Investor) => <span className="tabular-nums">{item.investmentCount}</span>,
    },
    {
      key: "currentValue",
      label: "Current Value",
      searchable: false,
      render: (item: Investor) => (
        <span className="font-medium tabular-nums">{formatCurrency(item.currentValue)}</span>
      ),
    },
  ]

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <Header title="Investors" subtitle="Manage investor accounts" />
      <div className="px-6 lg:px-8 pb-8">
        <DataTable
          data={investors as unknown as Record<string, unknown>[]}
          columns={columns as { key: string; label: string; render?: (item: Record<string, unknown>) => React.ReactNode; searchable?: boolean }[]}
          onRowClick={(item) => router.push(`/investors/${(item as unknown as Investor).id}`)}
        />
      </div>
    </motion.div>
  )
}
