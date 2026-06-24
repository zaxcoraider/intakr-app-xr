import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { EfficiencyChart } from "@/components/dashboard/efficiency-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function Home() {
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
            <MetricCards />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <ActivityFeed />
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
