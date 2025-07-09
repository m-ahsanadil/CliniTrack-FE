
import SuperAdminSystemSettings from '@/src/modules/Dashboard/(super-admin)/system-settings'

export interface SuperAdminSystemSettingsProps {
  role: string
}


export default async function SuperAdminSystemSettingsPage({ params }: { params: Promise<SuperAdminSystemSettingsProps> }) {
  const resolvedParams = await params

  return (
    <SuperAdminSystemSettings
      role={resolvedParams.role}
    />
  );
}
