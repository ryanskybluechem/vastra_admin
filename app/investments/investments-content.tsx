"use client"

import { useState, useTransition } from "react"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { InvestorSelect } from "@/components/investor-select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { formatCurrency, formatPercent, formatDate } from "@/lib/format"
import { createInvestmentAction, updateInvestmentAction, deleteInvestmentAction } from "./actions"

interface Investor {
  id: string
  name: string | null
  email: string
}

interface InvestmentsContentProps {
  investments: Record<string, unknown>[]
  investors: Investor[]
}

const TYPES = ["Multifamily", "Office", "Industrial", "Retail", "Mixed-Use", "Fund"]
const STATUSES = ["Active", "Distributing", "Exited"]

function statusColor(status: string) {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "Distributing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "Exited": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default: return ""
  }
}

export function InvestmentsContent({ investments, investors }: InvestmentsContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [userId, setUserId] = useState("")
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [location, setLocation] = useState("")
  const [investedAmount, setInvestedAmount] = useState("")
  const [currentValue, setCurrentValue] = useState("")
  const [returnPercent, setReturnPercent] = useState("")
  const [status, setStatus] = useState("")
  const [investedDate, setInvestedDate] = useState("")
  const [description, setDescription] = useState("")
  const [targetReturn, setTargetReturn] = useState("")
  const [loanBalance, setLoanBalance] = useState("")
  const [occupancy, setOccupancy] = useState("")

  function resetForm() {
    setUserId("")
    setName("")
    setType("")
    setLocation("")
    setInvestedAmount("")
    setCurrentValue("")
    setReturnPercent("")
    setStatus("")
    setInvestedDate(new Date().toISOString().split("T")[0])
    setDescription("")
    setTargetReturn("")
    setLoanBalance("")
    setOccupancy("")
  }

  function openCreate() {
    setEditing(null)
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(item: Record<string, unknown>) {
    setEditing(item)
    setUserId(String(item.user_id || ""))
    setName(String(item.name || ""))
    setType(String(item.type || ""))
    setLocation(String(item.location || ""))
    setInvestedAmount(String(item.invested_amount || ""))
    setCurrentValue(String(item.current_value || ""))
    setReturnPercent(String(item.return_percent || ""))
    setStatus(String(item.status || ""))
    setInvestedDate(String(item.invested_date || ""))
    setDescription(String(item.description || ""))
    setTargetReturn(String(item.target_return || ""))
    setLoanBalance(String(item.loan_balance || ""))
    setOccupancy(String(item.occupancy || ""))
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData()
    fd.set("user_id", userId)
    fd.set("name", name)
    fd.set("type", type)
    fd.set("location", location)
    fd.set("invested_amount", investedAmount)
    fd.set("current_value", currentValue)
    fd.set("return_percent", returnPercent)
    fd.set("status", status)
    fd.set("invested_date", investedDate)
    fd.set("description", description)
    fd.set("target_return", targetReturn)
    fd.set("loan_balance", loanBalance)
    fd.set("occupancy", occupancy)

    startTransition(async () => {
      if (editing) {
        await updateInvestmentAction(String(editing.id), fd)
      } else {
        await createInvestmentAction(fd)
      }
      setDialogOpen(false)
    })
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item: Record<string, unknown>) => (
        <span className="font-semibold">{String(item.name || "")}</span>
      ),
    },
    {
      key: "user_id",
      label: "Investor",
      render: (item: Record<string, unknown>) => {
        const users = (item as any).users
        return users?.name || users?.email || "Unknown"
      },
    },
    {
      key: "type",
      label: "Type",
      render: (item: Record<string, unknown>) => (
        <Badge variant="secondary">{String(item.type || "")}</Badge>
      ),
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "invested_amount",
      label: "Invested",
      render: (item: Record<string, unknown>) => formatCurrency(Number(item.invested_amount || 0)),
    },
    {
      key: "current_value",
      label: "Current Value",
      render: (item: Record<string, unknown>) => formatCurrency(Number(item.current_value || 0)),
    },
    {
      key: "return_percent",
      label: "Return %",
      render: (item: Record<string, unknown>) => formatPercent(Number(item.return_percent || 0)),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => (
        <Badge className={statusColor(String(item.status || ""))} variant="outline">
          {String(item.status || "")}
        </Badge>
      ),
    },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Investments" subtitle="Manage investor property holdings and fund positions" />
      <div className="px-6 lg:px-8 pb-8">
        <div className="flex justify-end mb-4">
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create Investment
          </Button>
        </div>

        <DataTable
          data={investments}
          columns={columns}
          actions={(item) => (
            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(item)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[540px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Investment" : "Create Investment"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Investor</Label>
              <InvestorSelect investors={investors} value={userId} onValueChange={(v) => setUserId(v || "")} />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => v && setType(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Invested Amount</Label>
                <Input type="number" step="0.01" value={investedAmount} onChange={(e) => setInvestedAmount(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label>Current Value</Label>
                <Input type="number" step="0.01" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label>Return %</Label>
                <Input type="number" step="0.1" value={returnPercent} onChange={(e) => setReturnPercent(e.target.value)} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Invested Date</Label>
              <Input type="date" value={investedDate} onChange={(e) => setInvestedDate(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Target Return</Label>
                <Input value={targetReturn} onChange={(e) => setTargetReturn(e.target.value)} placeholder="e.g. 15-18%" />
              </div>
              <div className="grid gap-2">
                <Label>Loan Balance</Label>
                <Input type="number" step="0.01" value={loanBalance} onChange={(e) => setLoanBalance(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Occupancy %</Label>
                <Input type="number" step="0.1" value={occupancy} onChange={(e) => setOccupancy(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Investment"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
        onConfirm={async () => {
          if (deleteTarget) await deleteInvestmentAction(String(deleteTarget.id))
        }}
      />
    </div>
  )
}
