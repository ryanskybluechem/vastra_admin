import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { createServerClient } from "@/lib/supabase/server"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me")

export interface Session {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    entity_name: string | null
    role: string
  }
}

export async function createSession(userId: string, email: string, name: string | null, role: string, entityName: string | null): Promise<string> {
  const token = await new SignJWT({ sub: userId, email, name, role, entity_name: entityName })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return token
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== "admin") return null
    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string,
        name: (payload.name as string) || null,
        image: null,
        entity_name: (payload.entity_name as string) || null,
        role: payload.role as string,
      },
    }
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
}

export async function loginAsAdmin(email: string): Promise<Session> {
  const supabase = createServerClient()
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error) {
    console.error("Supabase query error:", error.message, error.code, error.details)
    throw new Error(`DB_ERROR: ${error.message}`)
  }
  if (!user) throw new Error("User not found")
  if (user.role !== "admin") throw new Error("ACCESS_DENIED")

  await createSession(user.id, user.email, user.name, user.role, user.entity_name)
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: null,
      entity_name: user.entity_name,
      role: user.role,
    },
  }
}
