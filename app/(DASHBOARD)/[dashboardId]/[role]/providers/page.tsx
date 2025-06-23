import Provider from "@/src/modules/Dashboard/Provider"

export interface ProviderProps {
  dashboardId: string
  role: string
}

export default async function ProviderPage({ params }: { params: Promise<ProviderProps> }) {
  const resolvedParams = await params

  return <Provider dashboardId={resolvedParams.dashboardId} role={resolvedParams.role} />
}
