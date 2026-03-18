"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Building2, ArrowLeftRight, FileText, Sparkles, PenLine, CreditCard, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investors", label: "Investors", icon: Users },
  { href: "/investments", label: "Investments", icon: Building2 },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/offerings", label: "Offerings", icon: Sparkles },
  { href: "/e-signatures", label: "E-Signatures", icon: PenLine },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function MobileNav({ user }: { user: { name: string | null; email: string } }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating bottom bar + expandable drawer */}
      <div className="fixed left-4 right-4 z-50" style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}>
        {/* Drawer that expands up */}
        <div
          className={cn(
            "bg-background border border-border rounded-[20px] shadow-lg overflow-hidden transition-all duration-300 ease-out",
            open ? "max-h-[80vh]" : "max-h-[56px]"
          )}
        >
          {/* Expanded nav content */}
          {open && (
            <div className="px-2 pt-2 pb-2">
              {/* Header: app name left, close right */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/vastra-logo.png" alt="VÄSTRA" width={36} height={36} className="rounded-[8px]" />
                  <p className="text-[18px] font-semibold tracking-tight">
                    VÄSTRA <span className="text-[16px] text-brand font-semibold tracking-wide ml-1">ADMIN</span>
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-[12px] px-4 py-[10px] text-[22px] font-medium transition-colors",
                        isActive ? "bg-brand/12 text-brand dark:bg-brand-dim dark:text-brand-light" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-[22px] w-[22px]", isActive && "text-brand dark:text-brand-light")} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* User profile */}
              <div className="border-t border-border mt-3 pt-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand text-[16px] font-semibold">{initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[16px] font-medium">{user.name || user.email}</p>
                    <p className="truncate text-[16px] text-muted-foreground">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom bar: logo left, menu right */}
          {!open && (
            <div className="flex items-center justify-between px-4 h-[56px]">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vastra-logo.png" alt="VÄSTRA" width={28} height={28} className="rounded-[6px]" />
                <p className="text-[16px] font-semibold tracking-tight">
                  VÄSTRA <span className="text-[16px] text-brand font-semibold tracking-wide ml-0.5">ADMIN</span>
                </p>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
