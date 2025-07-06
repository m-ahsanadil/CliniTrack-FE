export interface AdminData {
    id: string;
    name: string;
    role: string;
    menu: string[];
}

export interface StatItem {
    [key: string]: string | number | undefined;
    value: number | string;
    change?: string;
}

export interface PatientName {
    _id: string;
    fullName: string;
}

export interface RecentMedicalRecord {
    patientName: PatientName;
    diagnosis: string;
    date: string;
}

export interface SuperAdmin {
    superadmin: AdminData;
    Profile: string;
    welcomeMessage: string;
    accessMessage: string;
    Department: string;
    stats: StatItem[];
    recentAppointments: Appointment[]; // currently an empty array
    recentMedicalRecords: RecentMedicalRecord[];
}

export interface SuperAdminGetResponse {
    success: true;
    message?: string;
    data: SuperAdmin;
}

export interface SuperAdminGetErrorResponse {
    success: false;
    message: string;
    data?: string;
}

export type SuperAdminGetApiResponse = SuperAdminGetResponse | SuperAdminGetErrorResponse;

// GET ADMIN
export interface Admin {
    admin: AdminData;
    Profile: string;
    welcomeMessage: string;
    accessMessage: string;
    Department: string;
    stats: StatItem[];
    recentAppointments: Appointment[]; // currently an empty array
    recentMedicalRecords: RecentMedicalRecord[];
}


export interface Appointment {
    // define fields if needed in future
}

export interface AdminGetResponse {
    success: true;
    message?: string
    data: Admin;
}

export interface AdminGetErrorResponse {
    success: false;
    message: string;
    data?: string;
}

export type AdminGetApiResponse = AdminGetResponse | AdminGetErrorResponse;


// GET DOCTOR

export interface Doctor {
    admin: AdminData;
    welcomeMessage: string;
    accessMessage: string;
    Department: string;
    stats: StatItem[];
    recentAppointments: Appointment[];
    recentMedicalRecords: RecentMedicalRecord[];
}

export interface DoctorGetResponse {
    success: true;
    message?: string
    data: Doctor;
}

export interface DoctorGetErrorResponse {
    success: false;
    message: string;
    data?: string;
}

export type DoctorGetApiResponse = DoctorGetResponse | DoctorGetErrorResponse;


// GET STAFF
export interface Staff {
    admin: AdminData;
    Profile: string;
    welcomeMessage: string;
    accessMessage: string;
    Department: string;
    stats: StatItem[];
    recentAppointments: any[]; // You can define a specific type later if needed
    recentMedicalRecords: RecentMedicalRecord[];
}

export interface StaffGetResponse {
    success: true;
    message?: string
    data: Staff;
}

export interface StaffGetErrorResponse {
    success: false;
    message: string;
    data?: string;
}

export type StaffGetApiResponse = StaffGetResponse | StaffGetErrorResponse;


export interface AppointmentCountGetResponse {
    success: boolean;
    count: number;
    message: string;
}

export interface AppointmentStatsGetResponse {
    success: boolean;
    stats: {
        [key: string]: number; // e.g., "Scheduled": 2, or could be other statuses
    };
    message: string;
}
