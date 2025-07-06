
import SuperAdminSystemSettings from '@/src/modules/Dashboard/(super-admin)/system-settings'

export interface SuperAdminSystemSettingsProps {
  dashboardId: string
  role: string
}


export default async function SuperAdminSystemSettingsPage({ params }: { params: Promise<SuperAdminSystemSettingsProps> }) {
  const resolvedParams = await params

  return (
    <SuperAdminSystemSettings
      dashboardId={resolvedParams.dashboardId}
      role={resolvedParams.role}
    />
  );
}
