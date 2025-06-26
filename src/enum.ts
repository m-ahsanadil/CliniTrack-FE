// =======================
// USER & ROLES
// =======================
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export const UserRoleValues = Object.values(UserRole);


// =======================
// REPORT
// =======================
export enum ReportStatus {
  GENERATED = 'Generated',
  PENDING = 'Pending',
  FAILED = 'Failed',
}

export const ReportStatusValues = Object.values(ReportStatus);


// =======================
// PROVIDER
// =======================
export enum ProviderStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
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
  URDU = 'Urdu',
  SPANISH = 'Spanish',
  ARABIC = 'Arabic',
  FRENCH = 'French',
  OTHER = 'Other',
}

export enum Relationship {
  SELF = 'Self',
  SPOUSE = 'Spouse',
  PARENT = 'Parent',
  CHILD = 'Child',
  SIBLING = 'Sibling',
  FRIEND = 'Friend',
  OTHER = 'Other',
}

export const GenderValues = Object.values(Gender);
export const LanguageValues = Object.values(Language);
export const RelationshipValues = Object.values(Relationship);
