import MedialRecord from "@/src/modules/Dashboard/medicalRecords"

export interface MedicalRecordProps {
  dashboardId: string
  role: string
}

export default function MedicalRecordsPage({ params }: { params: MedicalRecordProps }) {
  return (
    <MedialRecord
      dashboardId={params.dashboardId}
      role={params.role}
    />
  )
}
