import Provider from "@/src/modules/Dashboard/Provider"

export interface ProviderProps {
  role: string
}

export default async function ProviderPage({ params }: { params: Promise<ProviderProps> }) {
  const resolvedParams = await params

  return <Provider role={resolvedParams.role} />
}
