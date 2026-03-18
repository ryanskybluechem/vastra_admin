import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardStats, getRecentTransactions, getAllocationBreakdown } from "@/lib/queries/admin-dashboard"
import { DashboardContent } from "./dashboard-content"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [stats, recentTxns, allocation] = await Promise.all([
    getDashboardStats(),
    getRecentTransactions(10),
    getAllocationBreakdown(),
  ])

  return <DashboardContent stats={stats} recentTransactions={recentTxns} allocation={allocation} />
}
