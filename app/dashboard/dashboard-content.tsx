"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { DollarSign, Users, TrendingUp, ArrowDownToLine } from "lucide-react"
import { Header } from "@/components/header"
import { StatCard } from "@/components/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatCompactNumber, formatDate } from "@/lib/format"
import { pageVariants, staggerContainer, staggerChild } from "@/lib/animations"

interface DashboardStats {
  totalAUM: number
  totalInvested: number
  investors: number
  activeInvestments: number
  totalDistributed: number
}

interface Transaction {
  id: string
  date: string
  type: string
  investment: string
  amount: number
  status: string
  description: string
  users: { name: string; email: string }
}

interface AllocationItem {
  name: string
  value: number
  color: string
}

interface DashboardContentProps {
  stats: DashboardStats
  recentTransactions: Transaction[]
  allocation: AllocationItem[]
}

export function DashboardContent({ stats, recentTransactions, allocation }: DashboardContentProps) {
  const total = allocation.reduce((s, a) => s + a.value, 0)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <Header title="Dashboard" subtitle="Portfolio overview and recent activity" />

      <div className="px-6 lg:px-8 pb-8 space-y-6">
        {/* Stat Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard title="Total AUM" value={stats.totalAUM} formatFn={formatCompactNumber} icon={DollarSign} />
          <StatCard title="Total Investors" value={stats.investors} icon={Users} />
          <StatCard title="Active Investments" value={stats.activeInvestments} icon={TrendingUp} />
          <StatCard title="Total Distributed" value={stats.totalDistributed} formatFn={formatCompactNumber} icon={ArrowDownToLine} />
        </motion.div>

        {/* Allocation Chart + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Pie Chart */}
          <motion.div variants={staggerChild} initial="initial" animate="animate" className="ios-card p-5">
            <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Allocation Breakdown
            </h2>
            {allocation.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No allocation data</p>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-[160px] h-[160px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {allocation.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2.5 min-w-0">
                  {allocation.map((item) => (
                    <div key={item.name} className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[13px] truncate">{item.name}</span>
                      <span className="text-[12px] text-muted-foreground ml-auto">
                        {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={staggerChild} initial="initial" animate="animate" className="ios-card overflow-hidden lg:col-span-2">
            <div className="p-5 border-b border-border">
              <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Transactions
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                  <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Investor</TableHead>
                  <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Type</TableHead>
                  <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amount</TableHead>
                  <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No recent transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                        {formatDate(txn.date)}
                      </TableCell>
                      <TableCell className="text-[14px] font-medium">
                        {txn.users?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[14px] font-semibold text-right tabular-nums">
                        {formatCurrency(Number(txn.amount))}
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground max-w-[200px] truncate">
                        {txn.description || "--"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
