
export interface InvoiceService {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface InvoiceRequest {
    invoiceNumber: string;
    patientId: string;
    providerId: string;
    amount: number;
    totalAmount: number;
    status: string;
    issueDate: string;
    dueDate: string;
    services: InvoiceService[];
    notes: string;
    createdBy: string;
    updatedBy: string;
}
export interface InvoiceResponse {
    success: true;
    message: string;
}

export interface InvoiceErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type InvoiceApiResponse = InvoiceResponse | InvoiceErrorResponse;