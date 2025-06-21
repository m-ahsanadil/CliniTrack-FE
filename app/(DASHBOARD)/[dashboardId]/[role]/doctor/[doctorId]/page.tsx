import DoctorProfile from "@/src/modules/Dashboard/doctor"

export interface DoctorProfileProps {
    dashboardId: string
    role: string
    doctorId: string
}


export default function DoctorProfilePage({ params }: { params: DoctorProfileProps }) {
    return (
        <DoctorProfile
            dashboardId={params.dashboardId}
            role={params.role}
            doctorId={params.doctorId}
        />
    )
}
