import Dashboard from '@/src/modules/Dashboard/dashboard'

export interface DashboardProps {
  dashboardId: string
  role: string
}

export default function DashboardPage({ params }: { params: DashboardProps }) {
  return (<Dashboard
    dashboardId={params.dashboardId}
    role={params.role}
  />);

}
