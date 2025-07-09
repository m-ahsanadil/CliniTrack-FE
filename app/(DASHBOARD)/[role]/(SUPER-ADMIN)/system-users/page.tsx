import SuperAdminUsers from '@/src/modules/Dashboard/(super-admin)/system-users'

export interface SuperAdminUsersProps {
    role: string
}

export default async function SuperAdminUsersPage({ params }: { params: Promise<SuperAdminUsersProps> }) {
    const resolvedParams = await params

    return (
        <SuperAdminUsers
            role={resolvedParams.role}
        />
    );
}
