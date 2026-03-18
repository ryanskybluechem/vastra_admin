import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { getSession } from "@/lib/auth"

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "VÄSTRA Admin",
  description: "VÄSTRA Capital administration portal",
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {session ? (
            <div className="flex h-screen overflow-hidden">
              <div className="hidden lg:block">
                <AdminSidebar user={session.user} />
              </div>
              <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
              <MobileNav user={session.user} />
            </div>
          ) : (
            children
          )}
        </Providers>
      </body>
    </html>
  )
}
