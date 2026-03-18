import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PaymentsContent } from "./payments-content"

export default async function PaymentsPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  return <PaymentsContent />
}
