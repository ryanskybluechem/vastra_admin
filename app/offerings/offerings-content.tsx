"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { formatCurrency, formatDate } from "@/lib/format"
import { createOfferingAction, updateOfferingAction, deleteOfferingAction } from "./actions"
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Offering {
  id: string
  name: string
  type: string
  location: string
  description: string | null
  target_return: string | null
  minimum_investment: number | null
  fund_size: number | null
  funded: number | null
  status: string
  closing_date: string | null
  highlights: string[] | null
  created_at: string
}

interface OfferingsContentProps {
  offerings: Offering[]
}

const STATUS_OPTIONS = ["Open", "Closing Soon", "Fully Subscribed"] as const

function statusBadge(status: string) {
  switch (status) {
    case "Open":
      return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0">{status}</Badge>
    case "Closing Soon":
      return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0">{status}</Badge>
    case "Fully Subscribed":
      return <Badge className="bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-0">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function fundedPercent(funded: number | null, fundSize: number | null): string {
  if (!funded || !fundSize || fundSize === 0) return "0%"
  return `${((funded / fundSize) * 100).toFixed(1)}%`
}

export function OfferingsContent({ offerings }: OfferingsContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Offering | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Offering | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [targetReturn, setTargetReturn] = useState("")
  const [minimumInvestment, setMinimumInvestment] = useState("")
  const [fundSize, setFundSize] = useState("")
  const [funded, setFunded] = useState("")
  const [status, setStatus] = useState("Open")
  const [closingDate, setClosingDate] = useState("")
  const [highlights, setHighlights] = useState<string[]>([])

  function resetForm() {
    setName("")
    setType("")
    setLocation("")
    setDescription("")
    setTargetReturn("")
    setMinimumInvestment("")
    setFundSize("")
    setFunded("")
    setStatus("Open")
    setClosingDate("")
    setHighlights([])
    setEditing(null)
  }

  function openCreate() {
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(offering: Offering) {
    setEditing(offering)
    setName(offering.name)
    setType(offering.type)
    setLocation(offering.location)
    setDescription(offering.description || "")
    setTargetReturn(offering.target_return || "")
    setMinimumInvestment(offering.minimum_investment?.toString() || "")
    setFundSize(offering.fund_size?.toString() || "")
    setFunded(offering.funded?.toString() || "")
    setStatus(offering.status)
    setClosingDate(offering.closing_date || "")
    setHighlights(offering.highlights || [])
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set("name", name)
      formData.set("type", type)
      formData.set("location", location)
      formData.set("description", description)
      formData.set("target_return", targetReturn)
      formData.set("minimum_investment", minimumInvestment)
      formData.set("fund_size", fundSize)
      formData.set("funded", funded)
      formData.set("status", status)
      formData.set("closing_date", closingDate)
      formData.set("highlights", JSON.stringify(highlights.filter(Boolean)))

      if (editing) {
        await updateOfferingAction(editing.id, formData)
      } else {
        await createOfferingAction(formData)
      }
      setDialogOpen(false)
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteOfferingAction(deleteTarget.id)
    setDeleteTarget(null)
  }

  function addHighlight() {
    setHighlights([...highlights, ""])
  }

  function updateHighlight(index: number, value: string) {
    const updated = [...highlights]
    updated[index] = value
    setHighlights(updated)
  }

  function removeHighlight(index: number) {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item: Offering) => (
        <Link href={`/offerings/${item.id}`} className="font-semibold text-brand hover:underline flex items-center gap-1.5">
          {item.name}
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Link>
      ),
    },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    {
      key: "fund_size",
      label: "Fund Size",
      render: (item: Offering) => item.fund_size ? formatCurrency(item.fund_size) : "--",
      searchable: false,
    },
    {
      key: "funded",
      label: "Funded %",
      render: (item: Offering) => fundedPercent(item.funded, item.fund_size),
      searchable: false,
    },
    {
      key: "status",
      label: "Status",
      render: (item: Offering) => statusBadge(item.status),
    },
    {
      key: "closing_date",
      label: "Closing Date",
      render: (item: Offering) => item.closing_date ? formatDate(item.closing_date) : "--",
      searchable: false,
    },
  ]

  return (
    <div className="pb-8">
      <Header title="Offerings" subtitle="Manage investment opportunities" />

      <div className="px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            Create Offering
          </Button>
        </div>

        <DataTable
          data={offerings as unknown as Record<string, unknown>[]}
          columns={columns as { key: string; label: string; render?: (item: Record<string, unknown>) => React.ReactNode; searchable?: boolean }[]}
          actions={(item) => {
            const offering = item as unknown as Offering
            return (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(offering)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(offering)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            )
          }}
        />
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
        <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Offering" : "Create Offering"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the offering details below." : "Fill in the details for the new offering."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Fund name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type *</Label>
                <Input id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Real Estate" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Austin, TX" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the offering" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="target_return">Target Return</Label>
                <Input id="target_return" value={targetReturn} onChange={(e) => setTargetReturn(e.target.value)} placeholder="e.g. 18-22% IRR" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minimum_investment">Min. Investment</Label>
                <Input id="minimum_investment" type="number" value={minimumInvestment} onChange={(e) => setMinimumInvestment(e.target.value)} placeholder="50000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fund_size">Fund Size</Label>
                <Input id="fund_size" type="number" value={fundSize} onChange={(e) => setFundSize(e.target.value)} placeholder="5000000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="funded">Funded</Label>
                <Input id="funded" type="number" value={funded} onChange={(e) => setFunded(e.target.value)} placeholder="2500000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status *</Label>
                <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="closing_date">Closing Date</Label>
                <Input id="closing_date" type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} />
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <Label>Highlights</Label>
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={h}
                    onChange={(e) => updateHighlight(i, e.target.value)}
                    placeholder="e.g. Prime downtown location"
                  />
                  <Button variant="ghost" size="icon-sm" onClick={() => removeHighlight(i)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addHighlight} type="button">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Highlight
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => { setDialogOpen(false); resetForm() }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !name || !type || !location}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Save Changes" : "Create Offering"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Offering"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
