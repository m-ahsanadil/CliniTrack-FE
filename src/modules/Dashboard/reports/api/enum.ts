export enum ReportStatus {
  GENERATED = "Generated",
  PENDING = "Pending",
  FAILED = "Failed"
}

export enum ReportType {
  CLINIC_OPERATIONS = "Clinic Operations",
  FINANCIAL = "Financial",
  PATIENT_STATISTICS = "Patient Statistics"
}

export enum FilterStatus {
  COMPLETED = "Completed",
  PENDING = "Pending",
  CANCELLED = "Cancelled"
}

// You might also want to add other clinic-related enums here
// export enum UserRole {
//   ADMIN = "admin",
//   DOCTOR = "doctor",
//   NURSE = "nurse",
//   RECEPTIONIST = "receptionist"
// }

export enum AppointmentStatus {
  SCHEDULED = "Scheduled",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  NO_SHOW = "No Show"
}