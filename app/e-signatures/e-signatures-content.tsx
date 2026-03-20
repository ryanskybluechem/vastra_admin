"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { pageVariants } from "@/lib/animations"
import { PenLine, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockEnvelopes = [
  { id: "1", title: "Subscription Agreement — Vastra Opportunity Fund III", investor: "James Richardson", status: "pending", sentDate: "2026-03-15" },
  { id: "2", title: "Operating Agreement — Lakewood Senior Living", investor: "James Richardson", status: "completed", sentDate: "2026-03-10" },
  { id: "3", title: "Capital Call Acknowledgment — The Maxwell Mixed-Use", investor: "James Richardson", status: "expired", sentDate: "2026-02-01" },
]

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Awaiting Signature" },
  completed: { icon: CheckCircle2, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Signed" },
  expired: { icon: AlertCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Expired" },
}

export function ESignaturesContent() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="flex-1 overflow-auto">
      <Header title="E-Signatures" subtitle="Manage DocuSign envelopes and signature requests" />
      <div className="px-6 lg:px-8 pb-8">
        {/* Integration Status Banner */}
        <div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 p-5 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 shrink-0">
            <PenLine className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold">DocuSign Integration</h3>
            <p className="text-[13px] text-muted-foreground mt-1">
              Connect your DocuSign account to send, track, and manage signature requests directly from the admin portal.
              Investors will see pending signatures in their portal dashboard.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Button size="sm" className="bg-brand hover:bg-brand/90 text-white">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Connect DocuSign
              </Button>
              <Badge variant="outline" className="text-[11px]">Coming Soon</Badge>
            </div>
          </div>
        </div>

        {/* Mock Envelopes */}
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Envelopes</h3>
        <div className="space-y-3">
          {mockEnvelopes.map((env) => {
            const cfg = statusConfig[env.status]
            const StatusIcon = cfg.icon
            return (
              <div key={env.id} className="ios-card p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted shrink-0">
                  <PenLine className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold truncate">{env.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{env.investor} · Sent {env.sentDate}</p>
                </div>
                <Badge className={cfg.color} variant="outline">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {cfg.label}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
