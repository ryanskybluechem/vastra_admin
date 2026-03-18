"use server"

import { getSession } from "@/lib/auth"
import { createDocument, updateDocument, deleteDocument, uploadFile } from "@/lib/queries/admin-documents"
import { revalidatePath } from "next/cache"

export async function createDocumentAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")

  const userId = formData.get("user_id") as string
  const file = formData.get("file") as File | null

  let filePath: string | undefined
  let size: string | undefined

  if (file && file.size > 0) {
    const result = await uploadFile(file, userId)
    filePath = result.path
    size = result.size
  }

  await createDocument({
    user_id: userId,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    investment: formData.get("investment") as string,
    date: formData.get("date") as string,
    status: (formData.get("status") as string) || "New",
    size: size || (formData.get("size") as string) || undefined,
    file_path: filePath,
  })
  revalidatePath("/documents")
}

export async function updateDocumentAction(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")

  const file = formData.get("file") as File | null
  const userId = formData.get("user_id") as string

  const updates: Record<string, unknown> = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    investment: formData.get("investment") as string,
    date: formData.get("date") as string,
    status: (formData.get("status") as string) || undefined,
  }

  if (file && file.size > 0) {
    const result = await uploadFile(file, userId)
    updates.file_path = result.path
    updates.size = result.size
  }

  await updateDocument(id, updates)
  revalidatePath("/documents")
}

export async function deleteDocumentAction(id: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await deleteDocument(id)
  revalidatePath("/documents")
}
