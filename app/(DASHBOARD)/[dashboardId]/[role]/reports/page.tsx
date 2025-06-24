import Reports from "@/src/modules/Dashboard/reports"

export interface ReportsProps {
  dashboardId: string
  role: string
}

export default async function ReportsPage({ params }: { params: Promise<ReportsProps> }) {
  const resolvedParams = await params

  return <Reports dashboardId={resolvedParams.dashboardId} role={resolvedParams.role} />
}
