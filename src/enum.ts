// =======================
// USER & ROLES
// =======================
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superadmin',
}

export const UserRoleValues = Object.values(UserRole);

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
}

export const UserStatusValues = Object.values(UserStatus);


// =======================
// REPORT
// =======================
export enum ReportStatus {
  GENERATED = 'Generated',
  PENDING = 'Pending',
  FAILED = 'Failed',
}

export enum ReportType {
  CLINIC_OPERATIONS = "Clinic Operations",
  PATIENT_STATISTICS = "Patient Statistics",
  APPOINTMENT_SUMMARY = "Appointment Summary",
  BILLING_REPORT = "Billing Report",
  PROVIDER_PERFORMANCE = "Provider Performance",
  TREATMENT_OUTCOMES = "Treatment Outcomes",
  LAB_RESULTS = "Lab Results",
  FINANCIAL_SUMMARY = "Financial Summary",
  OTHER = "Other",
}

export const ReportTypeValues = Object.values(ReportType);
export const ReportStatusValues = Object.values(ReportStatus);


// =======================
// PROVIDER
// =======================
export enum ProviderStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export const ProviderStatusValues = Object.values(ProviderStatus);


// =======================
// PATIENT
// =======================
export enum PatientStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DECEASED = 'Deceased',
}

export const PatientStatusValues = Object.values(PatientStatus);


// =======================
// INVOICE
// =======================
export enum InvoiceStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
}

export const InvoiceStatusValues = Object.values(InvoiceStatus);


// =======================
// APPOINTMENT
// =======================
export enum AppointmentType {
  CONSULTATION = 'Consultation',
  FOLLOW_UP = 'Follow-up',
  EMERGENCY = 'Emergency',
  PROCEDURE = 'Procedure',
}

export enum AppointmentPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  RESCHEDULED = 'Rescheduled',
  NO_SHOW = 'No-show',
}

export enum DepartmentName {
  GENERAL_PRACTICE = "General Practice",
  PEDIATRICS = "Pediatrics",
  CARDIOLOGY = "Cardiology",
  DERMATOLOGY = "Dermatology",
  ENDOCRINOLOGY = "Endocrinology",
  GASTROENTEROLOGY = "Gastroenterology",
  NEUROLOGY = "Neurology",
  OBSTETRICS_GYNECOLOGY = "Obstetrics and Gynecology",
  ONCOLOGY = "Oncology",
  OPHTHALMOLOGY = "Ophthalmology",
  ORTHOPEDICS = "Orthopedics",
  PSYCHIATRY = "Psychiatry",
  PULMONOLOGY = "Pulmonology",
  RADIOLOGY = "Radiology",
  UROLOGY = "Urology",
  RHEUMATOLOGY = "Rheumatology",
  ENT = "Ear, Nose and Throat (ENT)",
  ANESTHESIOLOGY = "Anesthesiology",
  PATHOLOGY = "Pathology",
  INFECTIOUS_DISEASES = "Infectious Diseases",
  FAMILY_MEDICINE = "Family Medicine",
  INTERNAL_MEDICINE = "Internal Medicine",
  SURGERY = "Surgery",
  OTHER = "Other",
}

export const DepartmentNameValues = Object.values(DepartmentName)
export const AppointmentTypeValues = Object.values(AppointmentType);
export const AppointmentPriorityValues = Object.values(AppointmentPriority);
export const AppointmentStatusValues = Object.values(AppointmentStatus);


// =======================
// REMINDER
// =======================
export enum ReminderStatus {
  SENT = 'Sent',
  FAILED = 'Failed',
}

export const ReminderStatusValues = Object.values(ReminderStatus);


// =======================
// OTHER ENUMS
// =======================
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  UNKNOWN = 'Unknown',
}

export enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German',
  CHINESE = 'Chinese',
  URDU = 'Urdu',
  ARABIC = 'Arabic',
  OTHER = 'Other',
}

export enum Relationship {
  BROTHER = 'Brother',
  SELF = 'Self',
  SPOUSE = 'Spouse',
  PARENT = 'Parent',
  CHILD = 'Child',
  SIBLING = 'Sibling',
  FRIEND = 'Friend',
  OTHER = 'Other',
  HUSBAND = 'Husband',
  FATHER = 'Father',
}

export const GenderValues = Object.values(Gender);
export const LanguageValues = Object.values(Language);
export const RelationshipValues = Object.values(Relationship);
