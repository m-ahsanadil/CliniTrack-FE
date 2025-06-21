import DoctorProfile from "@/src/modules/Dashboard/doctor"

export interface DoctorProfileProps {
    dashboardId: string
    role: string
    doctorId: string
}


export default async function DoctorProfilePage({ params }: { params: Promise<DoctorProfileProps> }) {
    const resolvedParams = await params

    return (
        <DoctorProfile
            dashboardId={resolvedParams.dashboardId}
            role={resolvedParams.role}
            doctorId={resolvedParams.doctorId}
        />
    )
}
