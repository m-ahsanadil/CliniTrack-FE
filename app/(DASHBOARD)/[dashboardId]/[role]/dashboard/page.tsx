import Dashboard from '@/src/modules/Dashboard/dashboard'

export interface DashboardProps {
  dashboardId: string
  role: string
}

export default async function DashboardPage({ params }: { params: Promise<DashboardProps> }) {
  const resolvedParams = await params

  return (<Dashboard
    dashboardId={resolvedParams.dashboardId}
    role={resolvedParams.role}
  />);

}
