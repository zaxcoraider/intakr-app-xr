"use client"

import { MoreHorizontal, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const team = [
  { name: "Dr. Elena Cortez", role: "Admin", email: "elena@intakr.health", avatar: "/professional-woman-doctor-headshot.png" },
  { name: "James Whitfield", role: "Front Desk", email: "james@intakr.health" },
  { name: "Priya Nair", role: "Billing", email: "priya@intakr.health" },
]

function initials(name: string) {
  return name.replace(/Dr\.\s*/, "").split(" ").map((n) => n[0]).join("").slice(0, 2)
}

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">Clinic Profile</TabsTrigger>
        <TabsTrigger value="team">Team Members</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      {/* Clinic Profile */}
      <TabsContent value="profile" className="mt-6">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Clinic Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your clinic&apos;s public details and identifiers.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="clinic-name">Clinic Name</Label>
              <Input id="clinic-name" defaultValue="Intakr Family Health" />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="240 Wellness Ave, Suite 100, Austin, TX 78701" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="npi">NPI Number</Label>
              <Input id="npi" defaultValue="1538291746" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="(512) 555-0142" />
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            <Button>Save Changes</Button>
          </div>
        </Card>
      </TabsContent>

      {/* Team Members */}
      <TabsContent value="team" className="mt-6">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Team Members</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage who has access to your clinic.</p>
            </div>
            <Button variant="outline" className="bg-transparent">
              <UserPlus className="size-4" />
              Invite
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {team.map((member) => (
              <li key={member.email} className="flex items-center gap-4 px-6 py-4">
                <Avatar className="size-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
                <Badge variant="secondary">{member.role}</Badge>
                <button
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`Options for ${member.name}`}
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>

      {/* Billing */}
      <TabsContent value="billing" className="mt-6">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscription and payment method.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Professional Plan</p>
                <p className="text-xs text-muted-foreground">$199 / month · billed annually</p>
              </div>
              <Badge className="border-transparent bg-accent text-accent-foreground">Active</Badge>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="card">Card on file</Label>
                <Input id="card" defaultValue="Visa ending in 4242" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="billing-email">Billing email</Label>
                <Input id="billing-email" defaultValue="billing@intakr.health" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            <Button>Save Changes</Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
