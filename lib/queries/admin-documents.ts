import { createServerClient } from "@/lib/supabase/server"

export async function getAllDocuments() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("documents")
    .select("*, users(name, email)")
    .order("date", { ascending: false })
  return data || []
}

export async function createDocument(input: {
  user_id: string; name: string; type: string; category: string;
  investment: string; date: string; status?: string; size?: string;
}) {
  const supabase = createServerClient()
  const { error } = await supabase.from("documents").insert(input)
  if (error) throw new Error(error.message)
}

export async function updateDocument(id: string, updates: Record<string, unknown>) {
  const supabase = createServerClient()
  const { error } = await supabase.from("documents").update(updates).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteDocument(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
