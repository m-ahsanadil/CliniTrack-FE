
// Appointment Type Enum
export enum AppointmentType {
  CONSULTATION = "Consultation",
  FOLLOW_UP = "Follow-up",
  EMERGENCY = "Emergency",
  PROCEDURE = "Procedure"
}

// Appointment Status Enum
export enum AppointmentStatus {
  SCHEDULED = "Scheduled",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  RESCHEDULED = "Rescheduled",
  NO_SHOW = "No Show", 
//   CONFIRMED = "Confirmed",
//   IN_PROGRESS = "In Progress",
}

// Appointment Priority Enum
export enum AppointmentPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent"
}

// Time Zone Enum (Common ones for medical systems)
export enum TimeZone {
  ASIA_RIYADH = "Asia/Riyadh",
  ASIA_DUBAI = "Asia/Dubai",
  ASIA_KUWAIT = "Asia/Kuwait",
  ASIA_QATAR = "Asia/Qatar",
  UTC = "UTC",
  AMERICA_NEW_YORK = "America/New_York",
  EUROPE_LONDON = "Europe/London"
}

// Department Names Enum
export enum DepartmentName {
  GENERAL_MEDICINE = "General Medicine",
  CARDIOLOGY = "Cardiology",
  DERMATOLOGY = "Dermatology",
  ORTHOPEDICS = "Orthopedics",
  PEDIATRICS = "Pediatrics",
  GYNECOLOGY = "Gynecology",
  NEUROLOGY = "Neurology",
  PSYCHIATRY = "Psychiatry",
  RADIOLOGY = "Radiology",
  EMERGENCY = "Emergency",
  SURGERY = "Surgery",
  DENTISTRY = "Dentistry"
}

// User Roles Enum
export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  NURSE = "nurse",
  ADMIN = "admin",
  CLINIC_ADMIN = "clinicadmin",
  RECEPTIONIST = "receptionist"
}

// Gender Enum
export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other"
}

// Blood Type Enum
export enum BloodType {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-"
}

// Marital Status Enum
export enum MaritalStatus {
  SINGLE = "Single",
  MARRIED = "Married",
  DIVORCED = "Divorced",
  WIDOWED = "Widowed"
}

// Payment Status Enum
export enum PaymentStatus {
  PENDING = "Pending",
  PAID = "Paid",
  PARTIAL = "Partial",
  REFUNDED = "Refunded",
  CANCELLED = "Cancelled"
}

// Payment Method Enum
export enum PaymentMethod {
  CASH = "Cash",
  CREDIT_CARD = "Credit Card",
  DEBIT_CARD = "Debit Card",
  INSURANCE = "Insurance",
  BANK_TRANSFER = "Bank Transfer",
  DIGITAL_WALLET = "Digital Wallet"
}

// Notification Type Enum
export enum NotificationType {
  APPOINTMENT_REMINDER = "Appointment Reminder",
  APPOINTMENT_CONFIRMATION = "Appointment Confirmation",
  APPOINTMENT_CANCELLATION = "Appointment Cancellation",
  PAYMENT_DUE = "Payment Due",
  PAYMENT_RECEIVED = "Payment Received",
  TEST_RESULTS = "Test Results",
  PRESCRIPTION_READY = "Prescription Ready"
}

// Days of Week Enum
export enum DayOfWeek {
  SUNDAY = "Sunday",
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday"
}

export enum PatientStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending'
}

// Export all enum values as arrays for validation purposes
export const AppointmentTypeValues = Object.values(AppointmentType);
export const AppointmentStatusValues = Object.values(AppointmentStatus);
export const AppointmentPriorityValues = Object.values(AppointmentPriority);
export const TimeZoneValues = Object.values(TimeZone);
export const DepartmentNameValues = Object.values(DepartmentName);
export const UserRoleValues = Object.values(UserRole);
export const GenderValues = Object.values(Gender);
export const BloodTypeValues = Object.values(BloodType);
export const MaritalStatusValues = Object.values(MaritalStatus);
export const PaymentStatusValues = Object.values(PaymentStatus);
export const PaymentMethodValues = Object.values(PaymentMethod);
export const NotificationTypeValues = Object.values(NotificationType);
export const DayOfWeekValues = Object.values(DayOfWeek);