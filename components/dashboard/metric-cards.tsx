import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Users, ShieldCheck, Timer, DollarSign } from "lucide-react"

type Metric = {
  label: string
  value: string
  icon: React.ElementType
  trend?: { value: string; direction: "up" | "down" }
  highlight?: boolean
  caption: string
}

const metrics: Metric[] = [
  {
    label: "Patients Today",
    value: "48",
    icon: Users,
    trend: { value: "12%", direction: "up" },
    caption: "vs. yesterday",
  },
  {
    label: "Pending Verifications",
    value: "17",
    icon: ShieldCheck,
    highlight: true,
    caption: "Needs attention",
  },
  {
    label: "Avg. Intake Time",
    value: "4m 30s",
    icon: Timer,
    trend: { value: "8%", direction: "down" },
    caption: "faster this week",
  },
  {
    label: "Revenue This Month",
    value: "$84,200",
    icon: DollarSign,
    trend: { value: "5.4%", direction: "up" },
    caption: "vs. last month",
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend?.direction === "up" ? ArrowUpRight : ArrowDownRight
        return (
          <Card
            key={metric.label}
            className={cn(
              "border-border shadow-sm transition-shadow hover:shadow-md",
              metric.highlight && "border-orange-300 bg-orange-50",
            )}
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    metric.highlight ? "bg-orange-100 text-orange-600" : "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
              </div>
              <div className="flex items-end justify-between gap-2">
                <span
                  className={cn(
                    "font-heading text-3xl font-bold tracking-tight",
                    metric.highlight ? "text-orange-700" : "text-foreground",
                  )}
                >
                  {metric.value}
                </span>
                {metric.trend && (
                  <span
                    className={cn(
                      "mb-1 flex items-center gap-0.5 text-xs font-semibold",
                      metric.trend.direction === "up" ? "text-emerald-600" : "text-emerald-600",
                    )}
                  >
                    <TrendIcon className="size-3.5" aria-hidden="true" />
                    {metric.trend.value}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs",
                  metric.highlight ? "font-medium text-orange-600" : "text-muted-foreground",
                )}
              >
                {metric.caption}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
