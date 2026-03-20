"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate, formatCompactNumber } from "@/lib/format"
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  CheckCircle2,
  BarChart3,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react"

interface Offering {
  id: string
  name: string
  type: string
  location: string
  description: string | null
  target_return: string | null
  minimum_investment: number | null
  fund_size: number | null
  funded: number | null
  status: string
  closing_date: string | null
  highlights: string[] | null
  created_at: string
}

interface Investment {
  id: string
  user_id: string
  name: string
  invested_amount: number
  current_value: number
  return_percent: number
  status: string
  invested_date: string
  users: { name: string | null; email: string } | null
}

function statusBadge(status: string) {
  switch (status) {
    case "Open":
      return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0 text-[14px] px-3 py-1">{status}</Badge>
    case "Closing Soon":
      return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0 text-[14px] px-3 py-1">{status}</Badge>
    case "Fully Subscribed":
      return <Badge className="bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-0 text-[14px] px-3 py-1">{status}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function StatCard({ icon: Icon, label, value, sublabel }: { icon: React.ElementType; label: string; value: string; sublabel?: string }) {
  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[22px] font-bold tabular-nums">{value}</p>
      {sublabel && <p className="text-[13px] text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  )
}

export function OfferingDetailContent({ offering, investors }: { offering: Offering; investors: Investment[] }) {
  const router = useRouter()

  const fundedPercent = offering.funded && offering.fund_size && offering.fund_size > 0
    ? ((offering.funded / offering.fund_size) * 100)
    : 0

  const totalInvested = investors.reduce((sum, inv) => sum + inv.invested_amount, 0)
  const totalCurrentValue = investors.reduce((sum, inv) => sum + inv.current_value, 0)
  const avgReturn = investors.length > 0
    ? investors.reduce((sum, inv) => sum + inv.return_percent, 0) / investors.length
    : 0

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Offerings
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[28px] font-bold tracking-tight">{offering.name}</h1>
              {statusBadge(offering.status)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[14px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {offering.type}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {offering.location}
              </span>
              {offering.closing_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Closes {formatDate(offering.closing_date)}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push(`/offerings`)}>
            Edit Offering
          </Button>
        </div>
      </div>

      <div className="px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Target}
            label="Target Return"
            value={offering.target_return || "--"}
          />
          <StatCard
            icon={DollarSign}
            label="Fund Size"
            value={offering.fund_size ? formatCompactNumber(offering.fund_size) : "--"}
          />
          <StatCard
            icon={TrendingUp}
            label="Funded"
            value={`${fundedPercent.toFixed(1)}%`}
            sublabel={offering.funded ? formatCurrency(offering.funded) : undefined}
          />
          <StatCard
            icon={DollarSign}
            label="Min. Investment"
            value={offering.minimum_investment ? formatCurrency(offering.minimum_investment) : "--"}
          />
        </div>

        {/* Funding Progress Bar */}
        {offering.fund_size && offering.fund_size > 0 && (
          <div className="ios-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold">Funding Progress</span>
              <span className="text-[14px] text-muted-foreground">
                {offering.funded ? formatCurrency(offering.funded) : "$0"} of {formatCurrency(offering.fund_size)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${Math.min(fundedPercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[13px] text-muted-foreground">{fundedPercent.toFixed(1)}% funded</span>
              {offering.fund_size - (offering.funded || 0) > 0 && (
                <span className="text-[13px] text-muted-foreground">
                  {formatCurrency(offering.fund_size - (offering.funded || 0))} remaining
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList variant="line" className="mb-6">
            <TabsTrigger value="overview">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financials">
              <BarChart3 className="h-4 w-4" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="media">
              <ImageIcon className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="investors">
              <Users className="h-4 w-4" />
              Investors ({investors.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Description / Offering Memorandum */}
              <div className="ios-card p-5">
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" />
                  Offering Memorandum
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {offering.description || "No description provided. Edit this offering to add an offering memorandum with details about the investment opportunity, strategy, and terms."}
                </p>
              </div>

              {/* Investment Highlights */}
              <div className="ios-card p-5">
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  Investment Highlights
                </h3>
                {offering.highlights && offering.highlights.length > 0 ? (
                  <ul className="space-y-2.5">
                    {offering.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px]">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-muted-foreground">No highlights added yet. Edit this offering to add key selling points.</p>
                )}
              </div>

              {/* Deal Details */}
              <div className="ios-card p-5 lg:col-span-2">
                <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand" />
                  Deal Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Asset Type</p>
                    <p className="text-[14px] font-medium">{offering.type}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Location</p>
                    <p className="text-[14px] font-medium">{offering.location}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Target Return</p>
                    <p className="text-[14px] font-medium">{offering.target_return || "--"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Min. Investment</p>
                    <p className="text-[14px] font-medium">{offering.minimum_investment ? formatCurrency(offering.minimum_investment) : "--"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Fund Size</p>
                    <p className="text-[14px] font-medium">{offering.fund_size ? formatCurrency(offering.fund_size) : "--"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Capital Raised</p>
                    <p className="text-[14px] font-medium">{offering.funded ? formatCurrency(offering.funded) : "--"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Closing Date</p>
                    <p className="text-[14px] font-medium">{offering.closing_date ? formatDate(offering.closing_date) : "--"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Created</p>
                    <p className="text-[14px] font-medium">{formatDate(offering.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Users} label="Total Investors" value={String(investors.length)} />
              <StatCard icon={DollarSign} label="Total Invested" value={totalInvested > 0 ? formatCompactNumber(totalInvested) : "--"} />
              <StatCard icon={TrendingUp} label="Current Value" value={totalCurrentValue > 0 ? formatCompactNumber(totalCurrentValue) : "--"} />
              <StatCard icon={BarChart3} label="Avg. Return" value={avgReturn !== 0 ? `${avgReturn.toFixed(1)}%` : "--"} />
            </div>

            <div className="ios-card p-5">
              <h3 className="text-[16px] font-semibold mb-4">Financial Projections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="ios-card p-5 text-center">
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Target IRR</p>
                  <p className="text-[28px] font-bold text-brand">{offering.target_return || "--"}</p>
                  <p className="text-[13px] text-muted-foreground mt-1">Internal Rate of Return</p>
                </div>
                <div className="ios-card p-5 text-center">
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Equity Multiple</p>
                  <p className="text-[28px] font-bold text-foreground">1.8-2.2x</p>
                  <p className="text-[13px] text-muted-foreground mt-1">Projected Multiple</p>
                </div>
                <div className="ios-card p-5 text-center">
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Hold Period</p>
                  <p className="text-[28px] font-bold text-foreground">3-5 yrs</p>
                  <p className="text-[13px] text-muted-foreground mt-1">Expected Duration</p>
                </div>
              </div>
            </div>

            <div className="ios-card p-5 mt-4">
              <h3 className="text-[16px] font-semibold mb-4">Capital Structure</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-[14px] text-muted-foreground">Total Capitalization</span>
                  <span className="text-[14px] font-semibold">{offering.fund_size ? formatCurrency(offering.fund_size) : "--"}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-[14px] text-muted-foreground">LP Equity Raised</span>
                  <span className="text-[14px] font-semibold">{offering.funded ? formatCurrency(offering.funded) : "--"}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-[14px] text-muted-foreground">Remaining to Raise</span>
                  <span className="text-[14px] font-semibold">
                    {offering.fund_size ? formatCurrency(offering.fund_size - (offering.funded || 0)) : "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-[14px] text-muted-foreground">Minimum Investment</span>
                  <span className="text-[14px] font-semibold">{offering.minimum_investment ? formatCurrency(offering.minimum_investment) : "--"}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <div className="ios-card p-5">
              <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-brand" />
                Property Photos & Videos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* Placeholder cards for media uploads */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-brand/40 hover:text-brand/60 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-[12px] font-medium">Add Photo</span>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-muted-foreground mt-4">
                Media uploads coming soon. You&apos;ll be able to add property photos, drone footage, floor plans, and video walkthroughs.
              </p>
            </div>

            <div className="ios-card p-5 mt-4">
              <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand" />
                Documents
              </h3>
              <div className="space-y-2">
                {["Offering Memorandum (PPM)", "Subscription Agreement", "Operating Agreement", "Financial Projections"].map((doc) => (
                  <div key={doc} className="flex items-center justify-between py-3.5 px-4 rounded-2xl border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[14px] font-medium">{doc}</span>
                    </div>
                    <Badge variant="outline" className="text-[12px]">Upload</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Investors Tab */}
          <TabsContent value="investors">
            <div className="ios-card overflow-hidden">
              {investors.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Investor</TableHead>
                      <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Invested</TableHead>
                      <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Current Value</TableHead>
                      <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Return</TableHead>
                      <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                      <TableHead className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <div>
                            <p className="text-[14px] font-medium">{inv.users?.name || "Unknown"}</p>
                            <p className="text-[12px] text-muted-foreground">{inv.users?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-[14px] font-semibold text-right tabular-nums">
                          {formatCurrency(inv.invested_amount)}
                        </TableCell>
                        <TableCell className="text-[14px] font-semibold text-right tabular-nums">
                          {formatCurrency(inv.current_value)}
                        </TableCell>
                        <TableCell className="text-[14px] font-medium text-right tabular-nums">
                          <span className={inv.return_percent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}>
                            {inv.return_percent >= 0 ? "+" : ""}{inv.return_percent.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                          {formatDate(inv.invested_date)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={inv.status === "Active" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0" : ""}
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-[16px] font-medium mb-1">No investors yet</p>
                  <p className="text-[14px] text-muted-foreground">Investors will appear here once they subscribe to this offering.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
