import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getOfferingDetail, getOfferingInvestors } from "@/lib/queries/admin-offerings"
import { OfferingDetailContent } from "./offering-detail"

export default async function OfferingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const { id } = await params
  const [offering, investors] = await Promise.all([
    getOfferingDetail(id),
    getOfferingDetail(id).then((o) => o ? getOfferingInvestors(o.name) : []),
  ])

  if (!offering) notFound()

  return <OfferingDetailContent offering={offering} investors={investors} />
}
