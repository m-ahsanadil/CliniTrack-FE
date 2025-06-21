import Appointment from "@/src/modules/Dashboard/appointments"

export interface AppointmentProps {
    dashboardId: string
    role: string
}

export default function AppointmentsPage({ params }: { params: AppointmentProps }) {
    return (
        <Appointment
            dashboardId={params.dashboardId}
            role={params.role}
        />
    );
}
