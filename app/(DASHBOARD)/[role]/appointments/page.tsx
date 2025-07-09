import Appointment from "@/src/modules/Dashboard/appointments"

export interface AppointmentProps {
    role: string
}

export default async function AppointmentsPage({ params }: { params: Promise<AppointmentProps> }) {
    const resolvedParams = await params

    return (
        <Appointment
            role={resolvedParams.role}
        />
    );
}
