import CreateAdmin from '@/src/modules/Dashboard/(super-admin)/create-roles'

export interface CreateAdmminProps {
  role: string
}


export default async function CreateAdmminPage({ params }: { params: Promise<CreateAdmminProps> }) {
  const resolvedParams = await params

  return (
    <CreateAdmin
      role={resolvedParams.role}
    />
  );
}
