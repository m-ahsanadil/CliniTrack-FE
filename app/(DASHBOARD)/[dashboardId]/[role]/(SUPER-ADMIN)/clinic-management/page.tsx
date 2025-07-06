import ClinicManagement from '@/src/modules/Dashboard/(super-admin)/clinic-management'

export interface ClinicManagementProps {
  dashboardId: string
  role: string
}


export default async function ClinicManagementPage({ params }: { params: Promise<ClinicManagementProps> }) {
  const resolvedParams = await params

  return (
    <ClinicManagement
      dashboardId={resolvedParams.dashboardId}
      role={resolvedParams.role}
    />
  );
}
