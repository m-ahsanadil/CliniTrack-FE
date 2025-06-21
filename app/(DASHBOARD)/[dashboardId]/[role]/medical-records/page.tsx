import MedialRecord from "@/src/modules/Dashboard/medicalRecords"

export interface MedicalRecordProps {
  dashboardId: string
  role: string
}

export default async function MedicalRecordsPage({ params }: { params: Promise<MedicalRecordProps> }) {
  const resolvedParams = await params

  return (
    <MedialRecord
      dashboardId={resolvedParams.dashboardId}
      role={resolvedParams.role}
    />
  )
}
