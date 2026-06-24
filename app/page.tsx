import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back. Here&apos;s what&apos;s happening across your practice today.
            </p>
          </div>

          {/* Empty content area placeholder */}
          <div className="flex min-h-[60vh] items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
            <p className="text-sm text-muted-foreground">
              Your dashboard content will appear here.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
