import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "Verified" | "Pending" | "Completed"

const statusStyles: Record<Status, string> = {
  Verified: "bg-accent text-accent-foreground border-transparent",
  Pending: "bg-orange-100 text-orange-700 border-transparent",
  Completed: "bg-primary/10 text-primary border-transparent",
}

interface ActivityFeedProps {
  recentActivity?: any[]
}

export function ActivityFeed({ recentActivity }: ActivityFeedProps) {
  const displayActivities = recentActivity ?? []

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest patient check-ins across your clinic</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {displayActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
            <p className="text-sm font-medium text-foreground">No activity yet</p>
            <p className="text-xs text-muted-foreground">New patient intakes will appear here.</p>
          </div>
        ) : (
          displayActivities.map((activity: any) => {
            const displayStatus = activity.status || "Pending"
            return (
              <div
                key={activity.id || activity.name}
                className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60"
              >
                <Avatar className="size-10 border border-border">
                  <AvatarFallback>{(activity.name || "?").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{activity.name || "Unknown"}</p>
                  <p className="truncate text-xs text-muted-foreground">{activity.detail || "Patient activity"}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={cn("font-medium", statusStyles[displayStatus as Status])}>{displayStatus}</Badge>
                  <span className="text-xs text-muted-foreground">{activity.time || "Recently"}</span>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
