import { createServerClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = createServerClient()

  const [investorsRes, investmentsRes, transactionsRes] = await Promise.all([
    supabase.from("users").select("id", { count: "exact" }).eq("role", "investor"),
    supabase.from("investments").select("invested_amount, current_value, status"),
    supabase.from("transactions").select("amount, type").in("type", ["Distribution", "Return of Capital"]),
  ])

  const investors = investorsRes.count || 0
  const investments = investmentsRes.data || []
  const txns = transactionsRes.data || []

  const totalAUM = investments.reduce((s, i) => s + Number(i.current_value || 0), 0)
  const totalInvested = investments.reduce((s, i) => s + Number(i.invested_amount || 0), 0)
  const activeInvestments = investments.filter((i) => i.status === "Active").length
  const totalDistributed = txns.reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0)

  return { totalAUM, totalInvested, investors, activeInvestments, totalDistributed }
}

export async function getRecentTransactions(limit = 10) {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("transactions")
    .select("*, users(name, email)")
    .order("date", { ascending: false })
    .limit(limit)
  return data || []
}

export async function getAllocationBreakdown() {
  const supabase = createServerClient()
  const { data } = await supabase.from("investments").select("type, current_value")
  if (!data) return []

  const map: Record<string, number> = {}
  for (const inv of data) {
    map[inv.type] = (map[inv.type] || 0) + Number(inv.current_value || 0)
  }
  const colors: Record<string, string> = {
    Multifamily: "#3B82F6", Industrial: "#34D399", Office: "#F97316",
    Fund: "#A78BFA", Retail: "#FF375F", "Mixed-Use": "#30D5C8",
  }
  return Object.entries(map).map(([name, value]) => ({ name, value, color: colors[name] || "#888" }))
}
