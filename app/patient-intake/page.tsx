import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { IntakeForm } from "@/components/patient-intake/intake-form"

export default function PatientIntakePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance">
              New Patient Intake
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Register a new patient and capture their insurance details for verification.
            </p>
          </div>

          <IntakeForm />
        </main>
      </div>
    </div>
  )
}
