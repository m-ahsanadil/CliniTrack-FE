import * as Yup from "yup";
import { AppointmentPriorityValues, AppointmentStatus, AppointmentStatusValues, AppointmentTypeValues, DepartmentName, DepartmentNameValues, Gender, GenderValues, InvoiceStatus, InvoiceStatusValues, Language, LanguageValues, PatientStatus, PatientStatusValues, ProviderStatus, ProviderStatusValues, Relationship, RelationshipValues, ReportStatus, ReportStatusValues, ReportType, ReportTypeValues } from "../enum";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    // .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    // .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(5, 'Username must be at least 5 characters')
    .max(50, 'Username must be less than 50 characters')
    .matches(/^(?=(?:.*[a-zA-Z]){4,})(?=.*\d)[a-zA-Z0-9_]+$/, 'Username must contain at least 4 letters and 1 digit')
    .required('Username is required'),

  email: Yup.string()
    .email('Invalid email address')
    .matches(
      /^[^\d@]+@clinitrack\.com$/,
      'Email must end with @clinitrack.com and contain no digits'
    )
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),

  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must be less than 100 characters')
    .required('Full name is required'),

  role: Yup.string()
    .required('Role is required'),

  education: Yup.string()
    .min(2, 'Education must be at least 2 characters')
    .max(100, 'Education must be less than 100 characters')
    .required('Education is required'),

  dob: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in YYYY-MM-DD format')
    .required('Date of birth is required'),

  experience: Yup.string()
    .min(1, 'Experience must be at least 1 character')
    .max(100, 'Experience must be less than 100 characters')
    .required('Experience is required'),
});

export const updateProfileValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Full name is required"),

  age: Yup.number()
    .typeError("Age must be a number")
    .min(0, "Age must be a positive number")
    .max(120, "Age must be realistic")
    .required("Age is required"),

  dob: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
    .required("Date of birth is required"),

  speciality: Yup.string()
    .min(2, "Speciality must be at least 2 characters")
    .max(100, "Speciality must be less than 100 characters")
    .required("Speciality is required"),

  intro: Yup.string()
    .min(10, "Intro must be at least 10 characters")
    .max(500, "Intro must be less than 500 characters")
    .required("Intro is required"),

  field: Yup.string()
    .min(2, "Field must be at least 2 characters")
    .max(100, "Field must be less than 100 characters")
    .required("Field is required"),

  degree: Yup.string()
    .min(2, "Degree must be at least 2 characters")
    .max(100, "Degree must be less than 100 characters")
    .required("Degree is required"),

  education: Yup.string()
    .min(2, "Education must be at least 2 characters")
    .max(150, "Education must be less than 150 characters")
    .required("Education is required"),

  experience: Yup.string()
    .min(5, "Experience must be at least 5 characters")
    .max(300, "Experience must be less than 300 characters")
    .required("Experience is required"),
});

export const providerValidationSchema = Yup.object({
  providerId: Yup.string().required("Provider ID is required"),
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  specialty: Yup.mixed<DepartmentName>()
    .oneOf(DepartmentNameValues, "Invalid specialty")
    .required("Specialty is required"),
  phone: Yup.string()
    // .matches(/^\+966\d{9}$/, "Phone number must be a valid Saudi format (+966XXXXXXXXX)")
    .required("Phone number is required"),

  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\d@]+@clinitrack\.com$/, "Email must be from clinitrack.com and contain no digits before @")
    .required("Email is required"),

  address: Yup.object({
    street: Yup.string().min(2, "Street is required").required("Street is required"),
    city: Yup.string().min(2, "City is required").required("City is required"),
    state: Yup.string().min(2, "State is required").required("State is required"),
    zipCode: Yup.string().min(2, "Zip code is required").required("Zip code is required"),
    country: Yup.string().min(2, "Country is required").required("Country is required"),
  }).required("Address is required"),

  licenseNumber: Yup.string()
    .min(2, "License number must be at least 2 characters")
    .required("License number is required"),

  npiNumber: Yup.string()
    .matches(/^\d{10}$/, "NPI number must be exactly 10 digits")
    .required("NPI number is required"),

  clinicAffiliation: Yup.string()
    .min(2, "Clinic affiliation is required")
    .required("Clinic affiliation is required"),

  status: Yup.mixed<ProviderStatus>()
    .oneOf(ProviderStatusValues, "Invalid status")
    .required("Status is required"),

  createdBy: Yup.string().min(2).required("CreatedBy is required"),
  updatedBy: Yup.string().min(2).required("UpdatedBy is required"),
})

export const medicalRecordValidationSchema = Yup.object({
  patientId: Yup.string().required("Patient is required"),
  providerId: Yup.string().required("Provider is required"),
  diagnosis: Yup.string().min(3, "Diagnosis must be at least 3 characters").required("Diagnosis is required"),
  treatment: Yup.string().min(3, "Treatment must be at least 3 characters").required("Treatment is required"),
  prescription: Yup.string().min(3, "Prescription is required").required("Prescription is required"),
  notes: Yup.string().optional(),
  recordDate: Yup.string().required("Record date is required"),
  createdBy: Yup.string().min(2, "Creator name is required").required("Created By is required"),
  updatedBy: Yup.string().min(2, "Updater name is required").required("Updated By is required"),
});

export const appointmentValidationSchema = Yup.object({
  appointmentNumber: Yup.string()
    // .matches(/^AP-\d{4}-\d{4}-\d{3}$/, 'Invalid appointment number format (AP-YYYY-XXXX-XXX)')
    .required('Appointment number is required'),

  patientId: Yup.string()
    // .matches(/^[0-9a-fA-F]{24}$/, 'Invalid patient ID format')
    .required('Patient ID is required'),

  providerId: Yup.string()
    // .matches(/^[0-9a-fA-F]{24}$/, 'Invalid provider ID format')
    .required('Provider ID is required'),

  departmentName: Yup.mixed<DepartmentName>()
    .oneOf(DepartmentNameValues, 'Invalid department name')
    .required('Department name is required'),

  appointmentDate: Yup.date()
    .min(new Date(), 'Appointment date cannot be in the past')
    .required('Appointment date is required'),

  startTime: Yup.string()
    .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (HH:MM AM/PM)')
    .required('Start time is required'),

  endTime: Yup.string()
    .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (HH:MM AM/PM)')
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;

      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        return hour24 * 60 + minutes;
      };

      return parseTime(value) > parseTime(startTime);
    }),

  duration: Yup.number()
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration cannot exceed 8 hours')
    .required('Duration is required'),

  timeZone: Yup.string()
    .matches(/^[A-Za-z]+\/[A-Za-z_]+$/, 'Invalid timezone format')
    .required('Timezone is required'),

  type: Yup.string()
    .oneOf(AppointmentTypeValues, 'Invalid appointment type')
    .required('Appointment type is required'),

  priority: Yup.string()
    .oneOf(AppointmentPriorityValues, 'Invalid priority level')
    .required('Priority is required'),

  status: Yup.mixed<AppointmentStatus>()
    .oneOf(AppointmentStatusValues, 'Invalid appointment status')
    .required('Status is required'),

  location: Yup.object({
    facilityId: Yup.string()
      .matches(/^FAC-\d{3}$/, 'Invalid facility ID format (FAC-XXX)')
      .required('Facility ID is required'),

    facilityName: Yup.string()
      .min(2, 'Facility name must be at least 2 characters')
      .max(100, 'Facility name must be less than 100 characters')
      .required('Facility name is required'),

    roomNumber: Yup.string()
      .matches(/^[A-Z]-\d{3}$/, 'Invalid room number format (X-XXX)')
      .required('Room number is required'),

    address: Yup.string()
      .min(10, 'Address must be at least 10 characters')
      .max(200, 'Address must be less than 200 characters')
      .required('Address is required')
  }).required('Location is required'),

  reasonForVisit: Yup.string()
    .min(5, 'Reason for visit must be at least 5 characters')
    .max(500, 'Reason for visit must be less than 500 characters')
    .required('Reason for visit is required'),

  symptoms: Yup.array()
    .of(Yup.string().min(2, 'Each symptom must be at least 2 characters'))
    .min(1, 'At least one symptom is required')
    .max(10, 'Maximum 10 symptoms allowed')
    .required('Symptoms are required'),

  notes: Yup.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),

  createdBy: Yup.string()
    .min(2, 'Created by must be at least 2 characters')
    .max(50, 'Created by must be less than 50 characters')
    .required('Created by is required'),

  updatedBy: Yup.string()
    .min(2, 'Updated by must be at least 2 characters')
    .max(50, 'Updated by must be less than 50 characters')
    .required('Updated by is required')
});

export const appointmentRescheduleMinimalSchema = Yup.object({
  newAppointmentDate: Yup.date()
    .min(new Date(), 'New appointment date cannot be in the past')
    .required('New appointment date is required'),
  newStartTime: Yup.string()
    // .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (HH:MM AM/PM)')
    .required('New start time is required'),
  newEndTime: Yup.string()
    // .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (HH:MM AM/PM)')
    .required('New end time is required')
    .test('is-after-start', 'New end time must be after new start time', function (value) {
      const { newStartTime } = this.parent;
      if (!newStartTime || !value) return true;

      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        return hour24 * 60 + minutes;
      };

      return parseTime(value) > parseTime(newStartTime);
    })
});

export const patientValidationSchema = Yup.object({
  patientId: Yup.string()
    // .matches(/^P-\d{3}-CLINICS$/, 'Invalid patient ID format (e.g., P-001-CLINICS)')
    .required('Patient ID is required'),

  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),

  dateOfBirth: Yup.string()
    // .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .required('Date of birth is required'),

  gender: Yup.mixed<Gender>()
    .oneOf(GenderValues, 'Invalid gender')
    .required('Gender is required'),

  ssn: Yup.string()
    .matches(/^\d{3}-\d{2}-\d{4}$/, 'Invalid SSN format (e.g., 123-45-6789)')
    .required('SSN is required'),

  phone: Yup.string()
    // .matches(/^\+9665\d{8}$/, 'Phone number must be a valid Saudi number')
    .required('Phone is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  address: Yup.object({
    street: Yup.string().min(2, 'Street is required').required('Street is required'),
    city: Yup.string().min(2, 'City is required').required('City is required'),
    state: Yup.string().min(2, 'State is required').required('State is required'),
    zipCode: Yup.string().min(2, 'Zip code is required').required('Zip code is required'),
    country: Yup.string().min(2, 'Country is required').required('Country is required'),
  }).required('Address is required'),

  emergencyContact: Yup.object({
    name: Yup.string().min(2, 'Name is required').required('Emergency contact name is required'),
    relationship: Yup.mixed<Relationship>()
      .oneOf(RelationshipValues, 'Invalid relationship')
      .required('Relationship is required'),
    phone: Yup.string()
      // .matches(/^\+9665\d{8}$/, 'Phone number must be a valid Saudi number')
      .required('Emergency phone is required'),
    email: Yup.string().email('Invalid email address').required('Emergency email is required'),
  }).required('Emergency contact is required'),

  allergies: Yup.array()
    .of(Yup.string().min(2, 'Each allergy must be at least 2 characters'))
    .required('Allergies are required'),

  chronicConditions: Yup.array()
    .of(Yup.string().min(2, 'Each condition must be at least 2 characters'))
    .required('Chronic conditions are required'),

  currentMedications: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().min(2, 'Medication name is required').required('Medication name is required'),
        dosage: Yup.string().min(1, 'Dosage is required').required('Dosage is required'),
        frequency: Yup.string().min(1, 'Frequency is required').required('Frequency is required'),
        prescribedBy: Yup.string().min(2, 'Prescriber name is required').required('Prescribed by is required'),
        startDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date').required('Start date is required'),
      })
    )
    .required('Current medications are required'),

  insurance: Yup.object({
    provider: Yup.string().min(2, 'Provider name is required').required('Insurance provider is required'),
    policyNumber: Yup.string().min(2, 'Policy number is required').required('Policy number is required'),
    groupNumber: Yup.string().min(2, 'Group number is required').required('Group number is required'),
    subscriberId: Yup.string().min(2, 'Subscriber ID is required').required('Subscriber ID is required'),
    relationshipToSubscriber: Yup.mixed<Relationship>()
      .oneOf(RelationshipValues, 'Invalid relationship')
      .required('Relationship to subscriber is required'),
    effectiveDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid effective date').required('Effective date is required'),
    expirationDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid expiration date').required('Expiration date is required'),
  }).required('Insurance information is required'),

  status: Yup.mixed<PatientStatus>()
    .oneOf(PatientStatusValues, "Invalid status")
    .required("Status is required"),

  registrationDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid registration date')
    .required('Registration date is required'),

  preferredLanguage: Yup.mixed<Language>()
    .oneOf(LanguageValues, 'Invalid preferred language')
    .required('Preferred language is required'),

  createdBy: Yup.string()
    .min(2, 'Created by must be at least 2 characters')
    .required('Created by is required'),

  updatedBy: Yup.string()
    .min(2, 'Updated by must be at least 2 characters')
    .required('Updated by is required'),
});

export const reportValidationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters")
    .required("Title is required"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),

  reportDate: Yup.date()
    .typeError("Invalid report date")
    .required("Report date is required"),

  reportType: Yup.mixed<ReportType>()
    .oneOf(ReportTypeValues, "Invalid report type")
    .required("Report type is required"),

  generatedByUserId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .required("Generated By User ID is required"),

  dataFilters: Yup.object({
    startDate: Yup.date()
      .typeError("Invalid start date")
      .required("Start date is required"),
    endDate: Yup.date()
      .typeError("Invalid end date")
      .min(
        Yup.ref("startDate"),
        "End date must be after or equal to start date"
      )
      .required("End date is required"),
    status: Yup.mixed<AppointmentStatus>()
      .oneOf(AppointmentStatusValues, "Invalid appointment status")
      .required("Status is required"),
  }).required("Data filters are required"),

  status: Yup.mixed<ReportStatus>()
    .oneOf(ReportStatusValues, "Invalid report status")
    .required("Status is required"),

  createdBy: Yup.string()
    .min(2, "Created By must be at least 2 characters")
    .max(50, "Created By must be less than 50 characters")
    .required("Created By is required"),

  updatedBy: Yup.string()
    .min(2, "Updated By must be at least 2 characters")
    .max(50, "Updated By must be less than 50 characters")
    .required("Updated By is required"),
});

export const invoiceValidationSchema = Yup.object({
  invoiceNumber: Yup.string()
    .required("Invoice number is required"),

  patientId: Yup.string()
    .required("Patient ID is required"),

  providerId: Yup.string()
    .required("Provider ID is required"),

  amount: Yup.number()
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),

  totalAmount: Yup.number()
    .min(0, "Total amount cannot be negative")
    .required("Total amount is required"),

  status: Yup.mixed<InvoiceStatus>()
    .oneOf(InvoiceStatusValues, "Invalid invoice status")
    .required("Status is required"),

  issueDate: Yup.date()
    .required("Issue date is required"),

  dueDate: Yup.date()
    .min(Yup.ref("issueDate"), "Due date cannot be before issue date")
    .required("Due date is required"),

  services: Yup.array()
    .of(
      Yup.object({
        description: Yup.string()
          .min(3, "Description must be at least 3 characters")
          .required("Service description is required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        unitPrice: Yup.number()
          .min(0, "Unit price cannot be negative")
          .required("Unit price is required"),
        total: Yup.number()
          .min(0, "Total cannot be negative")
          .required("Total is required"),
      })
    )
    .min(1, "At least one service must be added")
    .required("Services are required"),

  notes: Yup.string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),

  createdBy: Yup.string()
    .required("Created by is required"),

  updatedBy: Yup.string()
    .required("Updated by is required"),
});