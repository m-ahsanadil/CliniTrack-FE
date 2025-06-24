import { useState } from "react"

export function useGenerateReport(patients: any[], appointments: any[], invoices: any[]) {
    const [reportType, setReportType] = useState("")
    const [dateRange, setDateRange] = useState("month")
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [generatedReport, setGeneratedReport] = useState<any>(null)

    const generateReport = () => {
        let reportData: any = {}

        switch (reportType) {
            case "revenue":
                reportData = {
                    title: "Revenue Report",
                    data: {
                        totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
                        paidInvoices: invoices.filter((inv) => inv.status === "Paid").length,
                        pendingInvoices: invoices.filter((inv) => inv.status === "Pending").length,
                        overdueInvoices: invoices.filter((inv) => inv.status === "Overdue").length,
                        averageInvoiceAmount:
                            invoices.length > 0 ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length : 0,
                        monthlyBreakdown: [
                            { month: "Jan", revenue: 12500 },
                            { month: "Feb", revenue: 15200 },
                            { month: "Mar", revenue: 18900 },
                            { month: "Apr", revenue: 16700 },
                        ],
                    },
                }
                break
            case "patients":
                reportData = {
                    title: "Patient Report",
                    data: {
                        totalPatients: patients.length,
                        activePatients: patients.filter((p) => p.status === "Active").length,
                        newPatients: Math.floor(patients.length * 0.2),
                        patientsByAge: {
                            "0-18": Math.floor(patients.length * 0.15),
                            "19-35": Math.floor(patients.length * 0.35),
                            "36-55": Math.floor(patients.length * 0.3),
                            "55+": Math.floor(patients.length * 0.2),
                        },
                        commonConditions: [
                            { condition: "Hypertension", count: 15 },
                            { condition: "Diabetes", count: 12 },
                            { condition: "Asthma", count: 8 },
                            { condition: "Arthritis", count: 6 },
                        ],
                    },
                }
                break
            case "appointments":
                reportData = {
                    title: "Appointment Report",
                    data: {
                        totalAppointments: appointments.length,
                        confirmedAppointments: appointments.filter((a) => a.status === "Confirmed").length,
                        pendingAppointments: appointments.filter((a) => a.status === "Pending").length,
                        cancelledAppointments: appointments.filter((a) => a.status === "Cancelled").length,
                        appointmentsByType: {
                            Consultation: appointments.filter((a) => a.type === "Consultation").length,
                            "Follow-up": appointments.filter((a) => a.type === "Follow-up").length,
                            "Check-up": appointments.filter((a) => a.type === "Check-up").length,
                            Treatment: appointments.filter((a) => a.type === "Treatment").length,
                        },
                        doctorSchedule: [
                            { doctor: "Dr. Smith", appointments: 25 },
                            { doctor: "Dr. Johnson", appointments: 20 },
                            { doctor: "Dr. Brown", appointments: 18 },
                            { doctor: "Dr. Wilson", appointments: 15 },
                        ],
                    },
                }
                break
        }

        setGeneratedReport(reportData)
    }

    return {
        reportType,
        setReportType,
        dateRange,
        setDateRange,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        generatedReport,
        generateReport,
    }
}
