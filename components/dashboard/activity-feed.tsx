import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "Verified" | "Pending" | "Completed"

type Activity = {
  name: string
  detail: string
  time: string
  status: Status
  avatar: string
  initials: string
}

const activities: Activity[] = [
  {
    name: "Marcus Bennett",
    detail: "Annual physical · Dr. Carter",
    time: "2m ago",
    status: "Verified",
    avatar: "/patients/patient-1.png",
    initials: "MB",
  },
  {
    name: "Sofia Alvarez",
    detail: "New patient intake",
    time: "11m ago",
    status: "Pending",
    avatar: "/patients/patient-2.png",
    initials: "SA",
  },
  {
    name: "Harold Whitfield",
    detail: "Follow-up · Cardiology",
    time: "24m ago",
    status: "Completed",
    avatar: "/patients/patient-3.png",
    initials: "HW",
  },
  {
    name: "Devon Pierce",
    detail: "Insurance verification",
    time: "38m ago",
    status: "Verified",
    avatar: "/patients/patient-4.png",
    initials: "DP",
  },
  {
    name: "Renee Coleman",
    detail: "Lab results review",
    time: "52m ago",
    status: "Completed",
    avatar: "/patients/patient-5.png",
    initials: "RC",
  },
]

const statusStyles: Record<Status, string> = {
  Verified: "bg-accent text-accent-foreground border-transparent",
  Pending: "bg-orange-100 text-orange-700 border-transparent",
  Completed: "bg-primary/10 text-primary border-transparent",
}

export function ActivityFeed() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest patient check-ins across your clinic</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {activities.map((activity) => (
          <div
            key={activity.name}
            className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60"
          >
            <Avatar className="size-10 border border-border">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
              <AvatarFallback>{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{activity.name}</p>
              <p className="truncate text-xs text-muted-foreground">{activity.detail}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={cn("font-medium", statusStyles[activity.status])}>{activity.status}</Badge>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
