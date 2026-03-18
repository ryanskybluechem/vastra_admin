"use server"
import { getSession } from "@/lib/auth"
import { updateInvestorProfile } from "@/lib/queries/admin-investors"
import { revalidatePath } from "next/cache"

export async function updateInvestor(userId: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized")

  await updateInvestorProfile(userId, {
    name: formData.get("name") as string,
    entity_name: formData.get("entity_name") as string,
    phone: formData.get("phone") as string,
  })
  revalidatePath(`/investors/${userId}`)
}
