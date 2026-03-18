import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllOfferings } from "@/lib/queries/admin-offerings"
import { OfferingsContent } from "./offerings-content"

export default async function OfferingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  const offerings = await getAllOfferings()
  return <OfferingsContent offerings={offerings} />
}
