import { createServerClient } from "@/lib/supabase/server"

export async function getAllTransactions() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("transactions")
    .select("*, users(name, email)")
    .order("date", { ascending: false })
  return data || []
}

export async function createTransaction(input: {
  user_id: string; date: string; type: string; investment: string;
  amount: number; status: string; description?: string;
}) {
  const supabase = createServerClient()
  const { error } = await supabase.from("transactions").insert(input)
  if (error) throw new Error(error.message)
}

export async function updateTransaction(id: string, updates: Record<string, unknown>) {
  const supabase = createServerClient()
  const { error } = await supabase.from("transactions").update(updates).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteTransaction(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("transactions").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
