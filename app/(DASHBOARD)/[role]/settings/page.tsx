import Settings from "@/src/modules/Dashboard/settings"

export interface SettingProps {
    role: string
}

export default async function SettingsPage({ params }: { params: Promise<SettingProps> }) {
    const resolvedParams = await params

    return (
        <Settings
            role={resolvedParams.role}
        />)
}
