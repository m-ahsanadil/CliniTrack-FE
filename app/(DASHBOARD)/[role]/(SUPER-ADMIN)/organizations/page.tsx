import Organization from "@/src/modules/Dashboard/(super-admin)/organization"
export interface OrganizationManagementProps {
  role: string
}


export default async function OrganizationManagementPage({ params }: { params: Promise<OrganizationManagementProps> }) {
  const resolvedParams = await params

  return (
    <Organization
      role={resolvedParams.role}
    />
  );
}
