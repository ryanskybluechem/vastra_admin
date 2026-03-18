"use server"

import { getSession } from "@/lib/auth"
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/queries/admin-transactions"
import { revalidatePath } from "next/cache"

export async function createTransactionAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await createTransaction({
    user_id: formData.get("user_id") as string,
    date: formData.get("date") as string,
    type: formData.get("type") as string,
    investment: formData.get("investment") as string,
    amount: Number(formData.get("amount")),
    status: formData.get("status") as string,
    description: (formData.get("description") as string) || undefined,
  })
  revalidatePath("/transactions")
}

export async function updateTransactionAction(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await updateTransaction(id, {
    date: formData.get("date") as string,
    type: formData.get("type") as string,
    investment: formData.get("investment") as string,
    amount: Number(formData.get("amount")),
    status: formData.get("status") as string,
    description: (formData.get("description") as string) || undefined,
  })
  revalidatePath("/transactions")
}

export async function deleteTransactionAction(id: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await deleteTransaction(id)
  revalidatePath("/transactions")
}
