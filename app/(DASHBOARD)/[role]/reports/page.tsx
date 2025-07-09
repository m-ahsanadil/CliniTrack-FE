import Reports from "@/src/modules/Dashboard/reports"

export interface ReportsProps {
  role: string
}

export default async function ReportsPage({ params }: { params: Promise<ReportsProps> }) {
  const resolvedParams = await params

  return <Reports role={resolvedParams.role} />
}
