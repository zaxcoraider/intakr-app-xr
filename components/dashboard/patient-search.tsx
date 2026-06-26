"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const mockPatients = [
  { id: "1", name: "Marcus Bennett", email: "marcus@example.com", avatar: "/patients/patient-1.png" },
  { id: "2", name: "Sofia Alvarez", email: "sofia@example.com", avatar: "/patients/patient-2.png" },
  { id: "3", name: "James Wilson", email: "james@example.com", avatar: "/patients/patient-3.png" },
  { id: "4", name: "Emily Chen", email: "emily@example.com", avatar: "/patients/patient-4.png" },
  { id: "5", name: "Robert Garcia", email: "robert@example.com", avatar: "/patients/patient-5.png" },
]

export function PatientSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return []
    return mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  const handleSelectPatient = (patient: (typeof mockPatients)[0]) => {
    setSearch("")
    setOpen(false)
    // Here you could navigate to patient details or perform an action
    console.log("[v0] Selected patient:", patient.name)
  }

  return (
    <Popover open={open && search.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="h-10 rounded-lg border-border bg-secondary/60 pl-9 text-sm focus-visible:bg-card"
            aria-label="Search patients"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpen(true)
            }}
            onFocus={() => search.length > 0 && setOpen(true)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-0" side="bottom">
        <div className="border-b border-border px-4 py-2">
          <p className="text-xs font-medium text-muted-foreground">
            {filteredPatients.length} result{filteredPatients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex max-h-64 flex-col overflow-y-auto">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={cn(
                  "flex items-center gap-3 border-b border-border px-4 py-2.5 text-left transition-colors hover:bg-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                )}
              >
                <Avatar className="size-10">
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {patient.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{patient.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No patients found</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
