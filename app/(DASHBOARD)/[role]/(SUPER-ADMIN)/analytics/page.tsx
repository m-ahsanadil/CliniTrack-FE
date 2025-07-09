
import Analytics from '@/src/modules/Dashboard/(super-admin)/analytics'

export interface SystemAnalyticsProps {
    role: string
}


export default async function SystemAnalyticsPage({ params }: { params: Promise<SystemAnalyticsProps> }) {
    const resolvedParams = await params

    return (
        <Analytics
            role={resolvedParams.role}
        />
    );
}
