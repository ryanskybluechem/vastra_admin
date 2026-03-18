import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getAllDocuments } from "@/lib/queries/admin-documents"
import { getInvestorUsers } from "@/lib/queries/admin-users"
import { DocumentsContent } from "./documents-content"

export default async function DocumentsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [documents, investors] = await Promise.all([
    getAllDocuments(),
    getInvestorUsers(),
  ])

  return <DocumentsContent documents={documents} investors={investors} />
}
