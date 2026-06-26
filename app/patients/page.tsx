import { getPatients } from "@/app/actions/patientActions"
import { PatientsList } from "@/components/patients/patients-list"

export const metadata = {
  title: "Patients — Intakr",
  description: "View and manage all patients in your clinic",
}

export default async function PatientsPage() {
  const patients = await getPatients()
  return (
    <main className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Patients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All registered patients and their current status.
        </p>
      </div>
      <PatientsList initialPatients={patients} />
    </main>
  )
}
