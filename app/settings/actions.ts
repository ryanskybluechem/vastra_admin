"use server"
import { getSession } from "@/lib/auth"
import { promoteToAdmin } from "@/lib/queries/admin-users"
import { revalidatePath } from "next/cache"

export async function promoteUserAction(userId: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")
  await promoteToAdmin(userId)
  revalidatePath("/settings")
}
