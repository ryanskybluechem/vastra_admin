import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllInvestors } from "@/lib/queries/admin-investors"
import { InvestorsContent } from "./investors-content"

export default async function InvestorsPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  const investors = await getAllInvestors()
  return <InvestorsContent investors={investors} />
}
