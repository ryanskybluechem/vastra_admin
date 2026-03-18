import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getAllInvestments } from "@/lib/queries/admin-investments"
import { getInvestorUsers } from "@/lib/queries/admin-users"
import { InvestmentsContent } from "./investments-content"

export default async function InvestmentsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [investments, investors] = await Promise.all([
    getAllInvestments(),
    getInvestorUsers(),
  ])

  return <InvestmentsContent investments={investments} investors={investors} />
}
