/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, ShieldAlert, Copy, Check } from "lucide-react"
import { FlickeringGrid } from "@/components/ui/flickering-grid"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
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

  const demoEmail = "kelly@vastrapm.com"

  const fillDemo = () => {
    setEmail(demoEmail)
  }

  const copyDemo = async () => {
    await navigator.clipboard.writeText(demoEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative flex min-h-screen" style={{ background: "#111113" }}>
      {/* Flickering grid behind everything */}
      <div className="absolute inset-0 overflow-hidden">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.15}
          color="rgb(232, 119, 46)"
          maxOpacity={0.12}
          className="w-full h-full"
        />
        {/* Radial fade centered on mobile, more coverage */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 50%, #111113 0%, transparent 100%)",
          }}
        />
        {/* Edge fades */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-[#111113]/80" />
      </div>

      {/* Left — brand (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-12"
        >
          <img
            src="/vastra-logo.png"
            alt="VÄSTRA"
            width={96}
            height={96}
            className="rounded-[22px] mb-8 shadow-2xl shadow-brand/10"
          />
          <h1 className="text-[36px] font-bold text-white tracking-tight leading-tight mb-3">
            VÄSTRA Admin
          </h1>
          <p className="text-[17px] text-white/40 max-w-sm leading-relaxed">
            Management portal for VÄSTRA Capital.
          </p>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-10 w-full max-w-[340px]"
        >
          <div className="lg:hidden flex flex-col items-center mb-10">
            <img
              src="/vastra-logo.png"
              alt="VÄSTRA"
              width={64}
              height={64}
              className="rounded-[16px] mb-4"
            />
            <p className="text-[16px] font-semibold tracking-tight text-white">VÄSTRA Admin</p>
          </div>

          <h2 className="text-[28px] font-bold tracking-tight text-center lg:text-left text-white">Sign In</h2>
          <p className="text-[16px] text-white/40 mt-1 mb-8 text-center lg:text-left">
            Access the management portal
          </p>

          {(unauthorized || error) && (
            <div className="mb-6 flex items-center gap-3 rounded-[12px] border border-red-500/20 bg-red-500/10 px-4 py-3">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-[16px] text-red-400">
                {error || "Access denied. Admin privileges required."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[16px] font-medium mb-1.5 text-white/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vastra.com"
                className="w-full h-12 px-4 rounded-[12px] border border-white/[0.08] text-[16px] text-white outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all placeholder:text-white/20"
                style={{ background: "rgba(17, 17, 19, 0.9)" }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full h-12 rounded-[12px] bg-brand hover:bg-brand/90 text-white font-semibold text-[16px] flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 text-center">
            <p className="text-[16px] text-white/30 mb-2">Try the demo — Login using</p>
            <div className="inline-flex items-center rounded-[10px] border border-brand/20 overflow-hidden" style={{ background: "rgba(17, 17, 19, 0.9)" }}>
              <button
                type="button"
                onClick={fillDemo}
                className="flex items-center gap-2 px-4 py-2.5 text-[16px] font-medium text-brand hover:bg-brand/10 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse shrink-0" />
                {demoEmail}
              </button>
              <button
                type="button"
                onClick={copyDemo}
                className="flex items-center justify-center w-10 h-10 border-l border-brand/20 text-brand/60 hover:text-brand hover:bg-brand/10 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[16px] text-white/20">
            Only admin accounts can access this portal.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
