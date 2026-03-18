"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { InvestorSelect } from "@/components/investor-select"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { promoteUserAction } from "./actions"
import { ShieldAlert } from "lucide-react"

interface Admin {
  id: string
  email: string
  name: string | null
  entity_name: string | null
  role: string
}

interface InvestorUser {
  id: string
  name: string | null
  email: string
}

interface SettingsContentProps {
  admin: Admin
  investorUsers: InvestorUser[]
}

export function SettingsContent({ admin, investorUsers }: SettingsContentProps) {
  const [selectedUserId, setSelectedUserId] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedUser = investorUsers.find((u) => u.id === selectedUserId)

  async function handlePromote() {
    if (!selectedUserId) return
    await promoteUserAction(selectedUserId)
    setSelectedUserId("")
  }

  return (
    <div className="pb-8">
      <Header title="Settings" />

      <div className="px-6 lg:px-8 space-y-6">
        {/* Admin Profile */}
        <div className="ios-card p-6">
          <h2 className="text-[16px] font-semibold mb-4">Admin Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
            <div>
              <p className="text-muted-foreground text-[12px] uppercase tracking-wider font-medium mb-1">Name</p>
              <p className="font-medium">{admin.name || "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[12px] uppercase tracking-wider font-medium mb-1">Email</p>
              <p className="font-medium">{admin.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[12px] uppercase tracking-wider font-medium mb-1">Entity</p>
              <p className="font-medium">{admin.entity_name || "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[12px] uppercase tracking-wider font-medium mb-1">Role</p>
              <p className="font-medium capitalize">{admin.role}</p>
            </div>
          </div>
        </div>

        {/* Promote User to Admin */}
        <div className="ios-card p-6">
          <h2 className="text-[16px] font-semibold mb-1">Promote User to Admin</h2>
          <p className="text-[13px] text-muted-foreground mb-4">
            Grant admin access to an investor. This action cannot be undone.
          </p>

          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <InvestorSelect
                investors={investorUsers}
                value={selectedUserId}
                onValueChange={(v) => setSelectedUserId(v || "")}
                placeholder="Select investor"
              />
            </div>
            <Button
              variant="destructive"
              disabled={!selectedUserId}
              onClick={() => setConfirmOpen(true)}
            >
              <ShieldAlert className="h-4 w-4 mr-1.5" />
              Promote to Admin
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Promote to Admin"
        description={`Are you sure you want to promote ${selectedUser?.name || selectedUser?.email || "this user"} to admin? This cannot be undone.`}
        onConfirm={handlePromote}
        variant="destructive"
      />
    </div>
  )
}
