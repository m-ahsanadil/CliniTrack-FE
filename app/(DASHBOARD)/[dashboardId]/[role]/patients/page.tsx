import Patients from "@/src/modules/Dashboard/patients"

export interface PatientsProps {
  dashboardId: string
  role: string
}

export default async function PatientsPage({ params }: { params: Promise<PatientsProps> }) {
  const resolvedParams = await params

  return (
    <Patients
      dashboardId={resolvedParams.dashboardId}
      role={resolvedParams.role}
    />
  )
}
