"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const unauthorized = searchParams.get("error") === "unauthorized"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.status === 403) {
        setError("Access denied. Admin privileges required.")
        setLoading(false)
        return
      }
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8" style={{ background: "#111113" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[380px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="flex flex-col items-center mb-10">
          <img src="/vastra-logo.png" alt="VÄSTRA" width={72} height={72} className="rounded-[18px] mb-5 shadow-2xl" />
          <h1 className="text-[28px] font-bold text-white tracking-tight">VÄSTRA Admin</h1>
          <p className="text-[14px] text-white/40 mt-1">Management Portal</p>
        </div>

        {(unauthorized || error) && (
          <div className="mb-6 flex items-center gap-3 rounded-[12px] border border-red-500/20 bg-red-500/10 px-4 py-3">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-[13px] text-red-400">
              {error || "Access denied. Admin privileges required."}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium mb-1.5 text-white/70">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vastra.com"
              className="w-full h-12 px-4 rounded-[12px] border border-white/[0.08] text-[15px] text-white outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all placeholder:text-white/20"
              style={{ background: "rgba(17, 17, 19, 0.9)" }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full h-12 rounded-[12px] bg-brand hover:bg-brand/90 text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-[12px] text-white/20">
          Only admin accounts can access this portal.
        </p>
      </motion.div>
    </div>
  )
}
