"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowLeft, Building2, Mail, Phone, Shield, Calendar, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate, formatPercent } from "@/lib/format"
import { pageVariants, staggerContainer, staggerChild } from "@/lib/animations"

interface Investor {
  id: string
  name: string
  email: string
  entity_name: string | null
  phone: string | null
  role: string
  created_at: string
}

interface Investment {
  id: string
  name: string
  type: string
  location: string
  invested_amount: number
  current_value: number
  return_percent: number
  status: string
}

interface Transaction {
  id: string
  date: string
  type: string
  investment: string
  amount: number
  status: string
  description: string
}

interface BankAccount {
  id: string
  bank_name: string
  account_type: string
  account_number: string
  routing_number: string
  is_primary: boolean
}

interface InvestorDetailContentProps {
  investor: Investor
  investments: Investment[]
  transactions: Transaction[]
  bankAccounts: BankAccount[]
  bankDebug?: string | null
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-mono font-medium tabular-nums">{value}</span>
        <button onClick={handleCopy} className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}

export function InvestorDetailContent({ investor, investments, transactions, bankAccounts, bankDebug }: InvestorDetailContentProps) {
  const router = useRouter()

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate">
      <div className="px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-[28px] font-bold tracking-tight leading-tight">{investor.name}</h1>
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="ios-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={staggerChild} className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="text-[14px] font-medium mt-0.5">{investor.email}</p>
                  </div>
                </motion.div>
                <motion.div variants={staggerChild} className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Entity</p>
                    <p className="text-[14px] font-medium mt-0.5">{investor.entity_name || "--"}</p>
                  </div>
                </motion.div>
                <motion.div variants={staggerChild} className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                    <p className="text-[14px] font-medium mt-0.5">{investor.phone || "--"}</p>
                  </div>
                </motion.div>
                <motion.div variants={staggerChild} className="flex items-start gap-3">
                  <Shield className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Role</p>
                    <p className="text-[14px] font-medium mt-0.5 capitalize">{investor.role}</p>
                  </div>
                </motion.div>
                <motion.div variants={staggerChild} className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Joined</p>
                    <p className="text-[14px] font-medium mt-0.5">{formatDate(investor.created_at)}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments">
            <div className="ios-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Name</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Type</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Location</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Invested</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Current Value</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Return</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No investments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    investments.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="text-[14px] font-medium">{inv.name}</TableCell>
                        <TableCell className="text-[13px]">{inv.type}</TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">{inv.location}</TableCell>
                        <TableCell className="text-[14px] font-medium text-right tabular-nums">
                          {formatCurrency(Number(inv.invested_amount))}
                        </TableCell>
                        <TableCell className="text-[14px] font-medium text-right tabular-nums">
                          {formatCurrency(Number(inv.current_value))}
                        </TableCell>
                        <TableCell className="text-[14px] font-medium text-right tabular-nums">
                          <span className={Number(inv.return_percent) >= 0 ? "text-emerald-600" : "text-red-500"}>
                            {formatPercent(Number(inv.return_percent))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={inv.status === "Active" ? "default" : "secondary"}
                            className="text-[11px]"
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bank-accounts">
            <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-amber-600 dark:text-amber-400">Sensitive Data</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Full account and routing numbers are shown below. This data is AES-256 encrypted at rest.
                  OAuth verification will be required when enabled.
                </p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {bankDebug && (
                <div className="col-span-full rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-[13px] text-red-400 font-mono">
                  DEBUG: {bankDebug}
                </div>
              )}
              {bankAccounts.length === 0 && !bankDebug ? (
                <div className="ios-card p-6 col-span-full text-center text-muted-foreground">
                  No bank accounts on file
                </div>
              ) : (
                bankAccounts.map((acct) => (
                  <motion.div key={acct.id} variants={staggerChild} className="ios-card p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-semibold">{acct.bank_name}</h3>
                      {acct.is_primary && (
                        <Badge className="bg-[var(--color-brand)] text-white text-[11px]">Primary</Badge>
                      )}
                    </div>
                    <p className="text-[13px] text-muted-foreground capitalize">{acct.account_type}</p>
                    <div className="space-y-1.5 pt-1">
                      <CopyRow label="Account" value={acct.account_number} />
                      <CopyRow label="Routing" value={acct.routing_number} />
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="ios-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Type</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Investment</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amount</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                    <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                          {formatDate(txn.date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[11px] font-medium">
                            {txn.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[14px]">{txn.investment || "--"}</TableCell>
                        <TableCell className="text-[14px] font-semibold text-right tabular-nums">
                          {formatCurrency(Number(txn.amount))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={txn.status === "Completed" ? "default" : "secondary"}
                            className="text-[11px]"
                          >
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground max-w-[200px] truncate">
                          {txn.description || "--"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
