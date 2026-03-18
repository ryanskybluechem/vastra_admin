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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/format"
import { createDocumentAction, updateDocumentAction, deleteDocumentAction } from "./actions"

interface Investor {
  id: string
  name: string | null
  email: string
}

interface DocumentsContentProps {
  documents: Record<string, unknown>[]
  investors: Investor[]
}

const DOC_TYPES = ["K-1", "Quarterly Report", "Annual Report", "Operating Agreement", "Capital Call Notice", "Distribution Notice", "Subscription Agreement"]
const CATEGORIES = ["Tax Forms", "Reports", "Agreements"]
const STATUSES = ["New", "Viewed", "Signed"]

function statusColor(status: string) {
  switch (status) {
    case "New": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "Viewed": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "Signed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    default: return ""
  }
}

export function DocumentsContent({ documents, investors }: DocumentsContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [userId, setUserId] = useState("")
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [category, setCategory] = useState("")
  const [investment, setInvestment] = useState("")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("")
  const [size, setSize] = useState("")

  function resetForm() {
    setUserId("")
    setName("")
    setType("")
    setCategory("")
    setInvestment("")
    setDate("")
    setStatus("")
    setSize("")
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
    setCategory(String(item.category || ""))
    setInvestment(String(item.investment || ""))
    setDate(String(item.date || ""))
    setStatus(String(item.status || ""))
    setSize(String(item.size || ""))
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData()
    fd.set("user_id", userId)
    fd.set("name", name)
    fd.set("type", type)
    fd.set("category", category)
    fd.set("investment", investment)
    fd.set("date", date)
    fd.set("status", status)
    fd.set("size", size)

    startTransition(async () => {
      if (editing) {
        await updateDocumentAction(String(editing.id), fd)
      } else {
        await createDocumentAction(fd)
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
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "date",
      label: "Date",
      render: (item: Record<string, unknown>) => item.date ? formatDate(String(item.date)) : "",
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
      <Header title="Documents" subtitle="Manage investor documents, reports, and agreements" />
      <div className="px-6 lg:px-8 pb-8">
        <div className="flex justify-end mb-4">
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create Document
          </Button>
        </div>

        <DataTable
          data={documents}
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
            <DialogTitle>{editing ? "Edit Document" : "Create Document"}</DialogTitle>
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
                    {DOC_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
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
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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
              <Label>Size (optional)</Label>
              <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 2.4 MB" />
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
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
        onConfirm={async () => {
          if (deleteTarget) await deleteDocumentAction(String(deleteTarget.id))
        }}
      />
    </div>
  )
}
