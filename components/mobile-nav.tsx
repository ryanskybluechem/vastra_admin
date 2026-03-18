"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Building2, ArrowLeftRight, FileText, Sparkles, PenLine, CreditCard, Settings, LogOut, Menu } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
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
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/vastra-logo.png" alt="VÄSTRA" width={36} height={36} className="rounded-[8px]" />
              <div>
                <p className="text-[15px] font-semibold tracking-tight">VÄSTRA</p>
                <p className="text-[11px] text-brand font-semibold tracking-wide">ADMIN</p>
              </div>
            </div>
            <nav className="flex-1 px-3 py-2 space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-[10px] px-3 py-[10px] text-[14px] font-medium transition-colors",
                      isActive ? "bg-brand/12 text-brand dark:bg-brand-dim dark:text-brand-light" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-brand dark:text-brand-light")} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-border px-4 py-4 mt-auto">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand text-[12px] font-semibold">{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-medium">{user.name || user.email}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/vastra-logo.png" alt="VÄSTRA" width={28} height={28} className="rounded-[6px]" />
        <p className="text-[14px] font-semibold tracking-tight">VÄSTRA <span className="text-[10px] text-brand font-semibold tracking-wide ml-1">ADMIN</span></p>
      </div>
    </div>
  )
}
