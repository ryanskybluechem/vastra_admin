import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ESignaturesContent } from "./e-signatures-content"

export default async function ESignaturesPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  return <ESignaturesContent />
}
