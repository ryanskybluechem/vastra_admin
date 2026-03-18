import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getAllTransactions } from "@/lib/queries/admin-transactions"
import { getInvestorUsers } from "@/lib/queries/admin-users"
import { TransactionsContent } from "./transactions-content"

export default async function TransactionsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [transactions, investors] = await Promise.all([
    getAllTransactions(),
    getInvestorUsers(),
  ])

  return <TransactionsContent transactions={transactions} investors={investors} />
}
