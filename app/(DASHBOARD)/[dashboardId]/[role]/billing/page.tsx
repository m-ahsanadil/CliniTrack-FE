import Billing from "@/src/modules/Dashboard/billing"

export interface BillingProps {
  dashboardId: string
  role: string
}

export default function BillingPage({ params }: { params: BillingProps }) {
  return (
    <Billing
      dashboardId={params.dashboardId}
      role={params.role}
    />
  )
}
