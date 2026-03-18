"use server"

import { getSession } from "@/lib/auth"
import { createDocument, updateDocument, deleteDocument } from "@/lib/queries/admin-documents"
import { revalidatePath } from "next/cache"

export async function createDocumentAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await createDocument({
    user_id: formData.get("user_id") as string,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    investment: formData.get("investment") as string,
    date: formData.get("date") as string,
    status: (formData.get("status") as string) || undefined,
    size: (formData.get("size") as string) || undefined,
  })
  revalidatePath("/documents")
}

export async function updateDocumentAction(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await updateDocument(id, {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    investment: formData.get("investment") as string,
    date: formData.get("date") as string,
    status: (formData.get("status") as string) || undefined,
    size: (formData.get("size") as string) || undefined,
  })
  revalidatePath("/documents")
}

export async function deleteDocumentAction(id: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await deleteDocument(id)
  revalidatePath("/documents")
}
