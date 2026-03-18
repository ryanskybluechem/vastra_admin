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
import { formatCurrencyDetailed, formatDate } from "@/lib/format"
import { createTransactionAction, updateTransactionAction, deleteTransactionAction } from "./actions"

interface Investor {
  id: string
  name: string | null
  email: string
}

interface TransactionsContentProps {
  transactions: Record<string, unknown>[]
  investors: Investor[]
}

const TYPES = ["Distribution", "Capital Call", "Contribution", "Return of Capital"]
const STATUSES = ["Completed", "Pending", "Processing"]

function typeColor(type: string) {
  switch (type) {
    case "Distribution": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "Capital Call": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "Contribution": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "Return of Capital": return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400"
    default: return ""
  }
}

export function TransactionsContent({ transactions, investors }: TransactionsContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [userId, setUserId] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("")
  const [investment, setInvestment] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("")
  const [description, setDescription] = useState("")

  function resetForm() {
    setUserId("")
    setDate(new Date().toISOString().split("T")[0])
    setType("")
    setInvestment("")
    setAmount("")
    setStatus("")
    setDescription("")
  }

  function openCreate() {
    setEditing(null)
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(item: Record<string, unknown>) {
    setEditing(item)
    setUserId(String(item.user_id || ""))
    setDate(String(item.date || ""))
    setType(String(item.type || ""))
    setInvestment(String(item.investment || ""))
    setAmount(String(item.amount || ""))
    setStatus(String(item.status || ""))
    setDescription(String(item.description || ""))
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData()
    fd.set("user_id", userId)
    fd.set("date", date)
    fd.set("type", type)
    fd.set("investment", investment)
    fd.set("amount", amount)
    fd.set("status", status)
    fd.set("description", description)

    startTransition(async () => {
      if (editing) {
        await updateTransactionAction(String(editing.id), fd)
      } else {
        await createTransactionAction(fd)
      }
      setDialogOpen(false)
    })
  }

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (item: Record<string, unknown>) => item.date ? formatDate(String(item.date)) : "",
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
        <Badge className={typeColor(String(item.type || ""))} variant="outline">
          {String(item.type || "")}
        </Badge>
      ),
    },
    {
      key: "investment",
      label: "Investment",
    },
    {
      key: "amount",
      label: "Amount",
      render: (item: Record<string, unknown>) => {
        const val = Number(item.amount || 0)
        return (
          <span className={val >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            {formatCurrencyDetailed(val)}
          </span>
        )
      },
    },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => (
        <Badge variant="secondary">{String(item.status || "")}</Badge>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item: Record<string, unknown>) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {String(item.description || "")}
        </span>
      ),
    },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Transactions" subtitle="Track distributions, capital calls, and contributions" />
      <div className="px-6 lg:px-8 pb-8">
        <div className="flex justify-end mb-4">
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create Transaction
          </Button>
        </div>

        <DataTable
          data={transactions}
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
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Transaction" : "Create Transaction"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Investor</Label>
              <InvestorSelect investors={investors} value={userId} onValueChange={(v) => setUserId(v || "")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
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
            </div>
            <div className="grid gap-2">
              <Label>Investment</Label>
              <Input value={investment} onChange={(e) => setInvestment(e.target.value)} required placeholder="Investment name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount</Label>
                <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
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
            <p className="text-xs text-muted-foreground">
              Note: Capital Calls and Contributions should use negative amounts. Distributions should be positive.
            </p>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
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
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={async () => {
          if (deleteTarget) await deleteTransactionAction(String(deleteTarget.id))
        }}
      />
    </div>
  )
}
