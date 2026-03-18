"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { pageVariants } from "@/lib/animations"
import { CreditCard, ExternalLink, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/format"

const mockPayments = [
  { id: "1", description: "Q1 2026 Distribution — Vastra Growth Fund II", investor: "James Richardson", amount: 18750, type: "outgoing", date: "2026-03-15", qbInvoice: "INV-2026-0312" },
  { id: "2", description: "Capital Call #4 — The Maxwell Mixed-Use", investor: "James Richardson", amount: 25000, type: "incoming", date: "2026-02-15", qbInvoice: "INV-2026-0287" },
  { id: "3", description: "Q1 2026 Preferred Return — Skyline Apartments", investor: "James Richardson", amount: 6250, type: "outgoing", date: "2026-02-28", qbInvoice: "INV-2026-0301" },
]

export function PaymentsContent() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="flex-1 overflow-auto">
      <Header title="Payments" subtitle="QuickBooks integration for investor payments and distributions" />
      <div className="px-6 lg:px-8 pb-8">
        {/* Integration Status Banner */}
        <div className="mb-6 rounded-xl border border-brand/20 bg-brand/5 p-5 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 shrink-0">
            <CreditCard className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold">QuickBooks Integration</h3>
            <p className="text-[13px] text-muted-foreground mt-1">
              Connect QuickBooks to sync distributions, capital calls, and investor payments automatically.
              Payment status will be reflected in the investor portal in real-time.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Button size="sm" className="bg-brand hover:bg-brand/90 text-white">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Connect QuickBooks
              </Button>
              <Badge variant="outline" className="text-[11px]">Coming Soon</Badge>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="ios-card p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pending Distributions</p>
            <p className="text-[24px] font-bold">{formatCurrency(43750)}</p>
            <p className="text-[12px] text-muted-foreground mt-1">3 pending payments</p>
          </div>
          <div className="ios-card p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Outstanding Capital Calls</p>
            <p className="text-[24px] font-bold">{formatCurrency(25000)}</p>
            <p className="text-[12px] text-muted-foreground mt-1">1 outstanding</p>
          </div>
          <div className="ios-card p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">This Month</p>
            <p className="text-[24px] font-bold">{formatCurrency(50000)}</p>
            <p className="text-[12px] text-muted-foreground mt-1">4 transactions</p>
          </div>
        </div>

        {/* Recent Payments */}
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Payments</h3>
        <div className="space-y-3">
          {mockPayments.map((payment) => (
            <div key={payment.id} className="ios-card p-4 flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                payment.type === "outgoing" ? "bg-emerald-500/10" : "bg-blue-500/10"
              }`}>
                {payment.type === "outgoing" ? (
                  <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                ) : (
                  <ArrowDownLeft className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate">{payment.description}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {payment.investor} · {payment.date}
                  {payment.qbInvoice && (
                    <span className="ml-2 text-brand">{payment.qbInvoice}</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-[16px] font-bold tabular-nums ${
                  payment.type === "outgoing" ? "text-emerald-600" : "text-blue-600"
                }`}>
                  {payment.type === "outgoing" ? "-" : "+"}{formatCurrency(payment.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
