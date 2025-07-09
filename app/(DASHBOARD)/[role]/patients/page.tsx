import Patients from "@/src/modules/Dashboard/patients"

export interface PatientsProps {
  role: string
}

export default async function PatientsPage({ params }: { params: Promise<PatientsProps> }) {
  const resolvedParams = await params

  return (
    <Patients
      role={resolvedParams.role}
    />
  )
}
