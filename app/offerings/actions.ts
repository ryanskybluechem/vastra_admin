"use server"
import { getSession } from "@/lib/auth"
import { createOffering, updateOffering, deleteOffering } from "@/lib/queries/admin-offerings"
import { revalidatePath } from "next/cache"

export async function createOfferingAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")

  const highlightsRaw = formData.get("highlights") as string
  const highlights = highlightsRaw ? JSON.parse(highlightsRaw) : []

  await createOffering({
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    location: formData.get("location") as string,
    description: (formData.get("description") as string) || undefined,
    target_return: (formData.get("target_return") as string) || undefined,
    minimum_investment: Number(formData.get("minimum_investment")) || undefined,
    fund_size: Number(formData.get("fund_size")) || undefined,
    funded: Number(formData.get("funded")) || undefined,
    status: formData.get("status") as string,
    closing_date: (formData.get("closing_date") as string) || undefined,
    highlights,
  })
  revalidatePath("/offerings")
}

export async function updateOfferingAction(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")

  const highlightsRaw = formData.get("highlights") as string
  const highlights = highlightsRaw ? JSON.parse(highlightsRaw) : []

  await updateOffering(id, {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    location: formData.get("location") as string,
    description: (formData.get("description") as string) || undefined,
    target_return: (formData.get("target_return") as string) || undefined,
    minimum_investment: Number(formData.get("minimum_investment")) || undefined,
    fund_size: Number(formData.get("fund_size")) || undefined,
    funded: Number(formData.get("funded")) || undefined,
    status: formData.get("status") as string,
    closing_date: (formData.get("closing_date") as string) || undefined,
    highlights,
  })
  revalidatePath("/offerings")
}

export async function deleteOfferingAction(id: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await deleteOffering(id)
  revalidatePath("/offerings")
}
