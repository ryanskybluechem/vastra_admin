import { createServerClient } from "@/lib/supabase/server"

export async function getAllOfferings() {
  const supabase = createServerClient()
  const { data } = await supabase.from("offerings").select("*").order("created_at", { ascending: false })
  return data || []
}

export async function createOffering(input: {
  name: string; type: string; location: string; description?: string;
  target_return?: string; minimum_investment?: number; fund_size?: number;
  funded?: number; status: string; closing_date?: string; highlights?: string[];
}) {
  const supabase = createServerClient()
  const { error } = await supabase.from("offerings").insert(input)
  if (error) throw new Error(error.message)
}

export async function updateOffering(id: string, updates: Record<string, unknown>) {
  const supabase = createServerClient()
  const { error } = await supabase.from("offerings").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteOffering(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("offerings").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
