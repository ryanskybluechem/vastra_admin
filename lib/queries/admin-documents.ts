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
  investment: string; date: string; status?: string; size?: string; file_path?: string;
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
  // Also delete the file from storage if it exists
  const { data: doc } = await supabase.from("documents").select("file_path").eq("id", id).single()
  if (doc?.file_path) {
    await supabase.storage.from("documents").remove([doc.file_path])
  }
  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function uploadFile(file: File, userId: string): Promise<{ path: string; size: string }> {
  const supabase = createServerClient()
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${userId}/${timestamp}_${safeName}`

  const { error } = await supabase.storage.from("documents").upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  const bytes = file.size
  const size = bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1_000)} KB`

  return { path, size }
}

export async function getSignedUrl(filePath: string): Promise<string | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600) // 1 hour
  if (error) return null
  return data.signedUrl
}
