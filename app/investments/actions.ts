"use server"

import { getSession } from "@/lib/auth"
import { createInvestment, updateInvestment, deleteInvestment } from "@/lib/queries/admin-investments"
import { revalidatePath } from "next/cache"

export async function createInvestmentAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await createInvestment({
    user_id: formData.get("user_id") as string,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    location: formData.get("location") as string,
    invested_amount: Number(formData.get("invested_amount")),
    current_value: Number(formData.get("current_value")),
    return_percent: Number(formData.get("return_percent")),
    status: formData.get("status") as string,
    invested_date: formData.get("invested_date") as string,
    description: (formData.get("description") as string) || undefined,
    target_return: (formData.get("target_return") as string) || undefined,
    loan_balance: Number(formData.get("loan_balance")) || undefined,
    occupancy: Number(formData.get("occupancy")) || undefined,
  })
  revalidatePath("/investments")
}

export async function updateInvestmentAction(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await updateInvestment(id, {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    location: formData.get("location") as string,
    invested_amount: Number(formData.get("invested_amount")),
    current_value: Number(formData.get("current_value")),
    return_percent: Number(formData.get("return_percent")),
    status: formData.get("status") as string,
    invested_date: formData.get("invested_date") as string,
    description: (formData.get("description") as string) || undefined,
    target_return: (formData.get("target_return") as string) || undefined,
    loan_balance: Number(formData.get("loan_balance")) || undefined,
    occupancy: Number(formData.get("occupancy")) || undefined,
  })
  revalidatePath("/investments")
}

export async function deleteInvestmentAction(id: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await deleteInvestment(id)
  revalidatePath("/investments")
}
