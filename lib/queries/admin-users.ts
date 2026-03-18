import { createServerClient } from "@/lib/supabase/server"

export async function getAllUsers() {
  const supabase = createServerClient()
  const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })
  return data || []
}

export async function getInvestorUsers() {
  const supabase = createServerClient()
  const { data } = await supabase.from("users").select("id, name, email").eq("role", "investor").order("name")
  return data || []
}

export async function promoteToAdmin(userId: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("users").update({ role: "admin", updated_at: new Date().toISOString() }).eq("id", userId)
  if (error) throw new Error(error.message)
}
