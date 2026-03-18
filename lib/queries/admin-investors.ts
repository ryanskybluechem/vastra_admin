import { createServerClient } from "@/lib/supabase/server"

export async function getAllInvestors() {
  const supabase = createServerClient()
  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, entity_name, phone, role, created_at")
    .eq("role", "investor")
    .order("created_at", { ascending: false })

  if (!users) return []

  // Get investment totals per user
  const { data: investments } = await supabase.from("investments").select("user_id, invested_amount, current_value")

  const investmentMap: Record<string, { total: number; count: number; currentValue: number }> = {}
  for (const inv of investments || []) {
    if (!investmentMap[inv.user_id]) investmentMap[inv.user_id] = { total: 0, count: 0, currentValue: 0 }
    investmentMap[inv.user_id].total += Number(inv.invested_amount || 0)
    investmentMap[inv.user_id].count += 1
    investmentMap[inv.user_id].currentValue += Number(inv.current_value || 0)
  }

  return users.map((u) => ({
    ...u,
    totalInvested: investmentMap[u.id]?.total || 0,
    investmentCount: investmentMap[u.id]?.count || 0,
    currentValue: investmentMap[u.id]?.currentValue || 0,
  }))
}

export async function getInvestorDetail(userId: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from("users").select("*").eq("id", userId).single()
  return data
}

export async function getInvestorInvestments(userId: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from("investments").select("*").eq("user_id", userId).order("invested_date", { ascending: false })
  return data || []
}

export async function getInvestorTransactions(userId: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from("transactions").select("*").eq("user_id", userId).order("date", { ascending: false })
  return data || []
}

export async function getInvestorBankAccountsDecrypted(userId: string) {
  const supabase = createServerClient()
  const key = process.env.BANK_ENCRYPTION_KEY
  if (!key) return []

  const { data, error } = await supabase.rpc("get_decrypted_bank_accounts", { p_user_id: userId, p_key: key })
  if (error) {
    console.error("Bank decryption error:", error)
    return []
  }
  return data || []
}

export async function updateInvestorProfile(userId: string, updates: { name?: string; entity_name?: string; phone?: string }) {
  const supabase = createServerClient()
  const { error } = await supabase.from("users").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", userId)
  if (error) throw new Error(error.message)
}
