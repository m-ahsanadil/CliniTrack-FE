import Settings from "@/src/modules/Dashboard/settings"

export interface SettingProps {
    dashboardId: string
    role: string
}

export default async function SettingsPage({ params }: { params: Promise<SettingProps> }) {
    const resolvedParams = await params

    return (
        <Settings
            dashboardId={resolvedParams.dashboardId}
            role={resolvedParams.role}
        />)
}
