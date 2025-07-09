import Billing from "@/src/modules/Dashboard/billing"

export interface BillingProps {
  role: string
}

export default async function BillingPage({ params }: { params: Promise<BillingProps> }) {
      const resolvedParams = await params

  return (
    <Billing
            role={resolvedParams.role}
    />
  )
}
