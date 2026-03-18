import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getInvestorDetail, getInvestorInvestments, getInvestorTransactions, getInvestorBankAccountsDecrypted } from "@/lib/queries/admin-investors"
import { InvestorDetailContent } from "./investor-detail"

export default async function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { id } = await params
  const [investor, investments, transactions, bankResult] = await Promise.all([
    getInvestorDetail(id),
    getInvestorInvestments(id),
    getInvestorTransactions(id),
    getInvestorBankAccountsDecrypted(id),
  ])

  if (!investor) notFound()

  return <InvestorDetailContent investor={investor} investments={investments} transactions={transactions} bankAccounts={bankResult.accounts} bankDebug={bankResult.debug} />
}
