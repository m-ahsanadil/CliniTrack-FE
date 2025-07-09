import MedialRecord from "@/src/modules/Dashboard/medicalRecords"

export interface MedicalRecordProps {
  role: string
}

export default async function MedicalRecordsPage({ params }: { params: Promise<MedicalRecordProps> }) {
  const resolvedParams = await params

  return (
    <MedialRecord
      role={resolvedParams.role}
    />
  )
}
