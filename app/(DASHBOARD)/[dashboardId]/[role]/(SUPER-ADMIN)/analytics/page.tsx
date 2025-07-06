
import Analytics from '@/src/modules/Dashboard/(super-admin)/analytics'
export interface SystemAnalyticsProps {
    dashboardId: string
    role: string
}


export default async function SystemAnalyticsPage({ params }: { params: Promise<SystemAnalyticsProps> }) {
    const resolvedParams = await params

    return (
        <Analytics
            dashboardId={resolvedParams.dashboardId}
            role={resolvedParams.role}
        />
    );
}
