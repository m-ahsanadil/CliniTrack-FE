import Settings from "@/src/modules/Dashboard/settings"

export interface SettingProps {
    dashboardId: string
    role: string
}

export default function SettingsPage({ params }: { params: SettingProps }) {
    return <Settings dashboardId={params.dashboardId} role={params.role} />
}
