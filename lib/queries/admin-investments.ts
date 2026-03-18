import { createServerClient } from "@/lib/supabase/server"

export async function getAllInvestments() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("investments")
    .select("*, users(name, email)")
    .order("invested_date", { ascending: false })
  return data || []
}

export async function createInvestment(input: {
  user_id: string; name: string; type: string; location: string;
  invested_amount: number; current_value: number; return_percent: number;
  status: string; invested_date: string; description?: string;
  target_return?: string; loan_balance?: number; occupancy?: number;
}) {
  const supabase = createServerClient()
  const { error } = await supabase.from("investments").insert(input)
  if (error) throw new Error(error.message)
}

export async function updateInvestment(id: string, updates: Record<string, unknown>) {
  const supabase = createServerClient()
  const { error } = await supabase.from("investments").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteInvestment(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("investments").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
