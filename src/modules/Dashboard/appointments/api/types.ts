
export interface AppointmentLocation {
    facilityId: string;
    facilityName: string;
    roomNumber: string;
    address: string;
}

export interface AppointmentRequest {
    appointmentNumber: string;
    patientId: string;
    providerId: string;
    departmentName: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    duration: number; 
    timeZone: string;
    type: string;
    priority: string;
    status: string;
    location: AppointmentLocation;
    reasonForVisit: string;
    symptoms: string[];
    notes: string;
    createdBy: string;
    updatedBy: string;
}

export interface AppointmentResponse {
    success: true;
    message: string;
}

export interface AppointmentErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type AppointmentApiResponse = AppointmentResponse | AppointmentErrorResponse;