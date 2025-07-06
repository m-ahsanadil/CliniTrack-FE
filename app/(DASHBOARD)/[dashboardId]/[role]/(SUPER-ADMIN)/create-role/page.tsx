import CreateAdmin from '@/src/modules/Dashboard/(super-admin)/create-admin'

export interface CreateAdmminProps {
  dashboardId: string
  role: string
}


export default async function CreateAdmminPage({ params }: { params: Promise<CreateAdmminProps> }) {
  const resolvedParams = await params

  return (
    <CreateAdmin
      dashboardId={resolvedParams.dashboardId}
      role={resolvedParams.role}
    />
  );
}
