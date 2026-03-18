import { createClient } from "@supabase/supabase-js"
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const key = serviceKey && serviceKey.startsWith("ey") ? serviceKey : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}
