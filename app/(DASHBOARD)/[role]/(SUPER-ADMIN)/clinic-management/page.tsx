import ClinicManagement from '@/src/modules/Dashboard/(super-admin)/clinic-management'

export interface ClinicManagementProps {
  role: string
}


export default async function ClinicManagementPage({ params }: { params: Promise<ClinicManagementProps> }) {
  const resolvedParams = await params

  return (
    <ClinicManagement
      role={resolvedParams.role}
    />
  );
}
