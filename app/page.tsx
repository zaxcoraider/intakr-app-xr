"use client"

import { useEffect, useState, useTransition } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { LiveMetrics } from "@/components/dashboard/live-metrics"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { EfficiencyChart } from "@/components/dashboard/efficiency-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { getDashboardStats } from "@/app/actions/patientActions"

export default function Home() {
  const [stats, setStats] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const data = await getDashboardStats()
      if (data) setStats(data)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance">
                Clinic Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back. Here&apos;s what&apos;s happening across your practice today.
              </p>
            </div>
            <QuickActions />
          </div>

          <div className="flex flex-col gap-6">
            <LiveMetrics />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <ActivityFeed recentActivity={stats?.recentActivity} />
              </div>
              <div className="lg:col-span-3">
                <EfficiencyChart />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
