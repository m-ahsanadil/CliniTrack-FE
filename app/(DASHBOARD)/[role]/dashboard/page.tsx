import Dashboard from '@/src/modules/Dashboard/dashboard'

export interface DashboardProps {
  role: string
}

export default async function DashboardPage({ params }: { params: Promise<DashboardProps> }) {
  const resolvedParams = await params

  return (<Dashboard
    role={resolvedParams.role}
  />);

}
