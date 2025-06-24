import Appointment from "@/src/modules/Dashboard/appointments"

export interface AppointmentProps {
    dashboardId: string
    role: string
}

export default async function AppointmentsPage({ params }: { params: Promise<AppointmentProps> }) {
    const resolvedParams = await params

    return (
        <Appointment
            dashboardId={resolvedParams.dashboardId}
            role={resolvedParams.role}
        />
    );
}
