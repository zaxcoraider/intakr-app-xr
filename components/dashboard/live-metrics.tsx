"use client"

import { useEffect, useState, useTransition } from "react"
import { Users, ShieldAlert, Clock, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getDashboardStats } from "@/app/actions/patientActions"

type Stats = {
  totalPatientsToday: number
  pendingVerifications: number
  revenue: number
  avgTime: string
  recentActivity?: any[]
}

export function LiveMetrics() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isPending, startTransition] = useTransition()

  const refreshStats = () => {
    startTransition(async () => {
      const data = await getDashboardStats()
      if (data) setStats(data)
    })
  }

  useEffect(() => {
    refreshStats()
  }, [])

  const pendingHigh = (stats?.pendingVerifications ?? 0) >= 5

  const cards = [
    {
      label: "Patients Today",
      value: stats ? stats.totalPatientsToday.toLocaleString() : "—",
      icon: Users,
      trend: "+12%",
      trendUp: true,
      highlight: false,
    },
    {
      label: "Pending Verifications",
      value: stats ? stats.pendingVerifications.toLocaleString() : "—",
      icon: ShieldAlert,
      trend: pendingHigh ? "Action needed" : "On track",
      trendUp: false,
      highlight: pendingHigh,
    },
    {
      label: "Avg. Intake Time",
      value: stats ? stats.avgTime : "—",
      icon: Clock,
      trend: "-1m 12s",
      trendUp: true,
      highlight: false,
    },
    {
      label: "Revenue This Month",
      value: stats ? `$${stats.revenue.toLocaleString()}` : "—",
      icon: DollarSign,
      trend: "+8%",
      trendUp: true,
      highlight: false,
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshStats}
          disabled={isPending}
          className="gap-2 text-muted-foreground"
        >
          <RefreshCw className={cn("size-4", isPending && "animate-spin")} />
          Refresh data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          const TrendIcon = card.trendUp ? ArrowUpRight : ArrowDownRight
          return (
            <Card
              key={card.label}
              className={cn(
                "p-5 transition-colors",
                card.highlight && "border-orange-300 bg-orange-50",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    card.highlight ? "bg-orange-100 text-orange-600" : "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    card.highlight ? "text-orange-600" : card.trendUp ? "text-emerald-600" : "text-muted-foreground",
                  )}
                >
                  {!card.highlight && <TrendIcon className="size-3.5" />}
                  {card.trend}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">{card.label}</p>
              <p
                className={cn(
                  "mt-1 font-heading text-3xl font-bold tracking-tight",
                  card.highlight ? "text-orange-700" : "text-foreground",
                )}
              >
                {card.value}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
