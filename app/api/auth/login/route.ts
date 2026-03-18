import { loginAsAdmin, clearSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    const session = await loginAsAdmin(email.toLowerCase().trim())
    return NextResponse.json({ user: session.user })
  } catch (error) {
    if (error instanceof Error && error.message === "ACCESS_DENIED") {
      await clearSession()
      return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 })
    }
    const msg = error instanceof Error ? error.message : "Unknown error"
    console.error("Login error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
