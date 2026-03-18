import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getInvestorUsers } from "@/lib/queries/admin-users"
import { SettingsContent } from "./settings-content"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  const investorUsers = await getInvestorUsers()
  return <SettingsContent admin={session.user} investorUsers={investorUsers} />
}
