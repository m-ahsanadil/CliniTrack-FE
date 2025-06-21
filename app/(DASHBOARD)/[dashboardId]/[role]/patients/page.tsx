import Patients from "@/src/modules/Dashboard/patients"

export interface PatientsProps {
  dashboardId: string
  role: string
}

export default function PatientsPage({ params }: { params: PatientsProps }) {
  return <Patients dashboardId={params.dashboardId} role={params.role} />
}
