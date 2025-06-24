import Billing from "@/src/modules/Dashboard/billing"

export interface BillingProps {
  dashboardId: string
  role: string
}

export default async function BillingPage({ params }: { params: Promise<BillingProps> }) {
      const resolvedParams = await params

  return (
    <Billing
     dashboardId={resolvedParams.dashboardId}
            role={resolvedParams.role}
    />
  )
}
