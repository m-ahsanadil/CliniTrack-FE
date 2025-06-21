//POST
export interface InvoicePostRequest {
    invoiceNumber: string;
    patientId: string;
    providerId: string;
    amount: number;
    totalAmount: number;
    status: "Pending" | "Paid" | "Overdue";
    issueDate: string;
    dueDate: string;
    services: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    notes?: string;
    createdBy: string;
    updatedBy: string;
}


export interface InvoicePostResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        invoiceNumber: string;
        patientId: string;
        providerId: string;
        amount: number;
        totalAmount: number;
        status: "Pending" | "Paid" | "Overdue";
        issueDate: string;
        dueDate: string;
        services: {
            _id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
        notes?: string;
        createdBy: string;
        updatedBy: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}


export interface InvoicePostErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type InvoicePostApiResponse = InvoicePostResponse | InvoicePostErrorResponse;

// GET ALL
export interface InvoiceGetResponse {
    success: boolean;
    count: number;
    data: {
        _id: string;
        invoiceNumber: string;
        patientId: {
            _id: string;
            fullName: string;
        };
        providerId: {
            _id: string;
            name: string;
        };
        amount: number;
        totalAmount: number;
        status: "Pending" | "Paid" | "Overdue";
        issueDate: string; // ISO Date string
        dueDate: string;   // ISO Date string
        services: {
            _id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
        notes?: string;
        createdBy: string;
        updatedBy: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }[];
}

export interface InvoiceGetErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type InvoiceGetApiResponse = InvoiceGetResponse | InvoiceGetErrorResponse;




// GET BY ID
export interface InvoiceGetByIdResponse {
    success: boolean;
    data: {
        _id: string;
        invoiceNumber: string;
        patientId: {
            _id: string;
            fullName: string;
        };
        providerId: {
            _id: string;
            name: string;
        };
        amount: number;
        totalAmount: number;
        status: "Pending" | "Paid" | "Overdue";
        issueDate: string; // ISO string
        dueDate: string;   // ISO string
        services: {
            _id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
        notes?: string;
        createdBy: string;
        updatedBy: string;
        createdAt: string;
        updatedAt: string;
        __v: number;

    }

}

export interface InvoiceGetByIdErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type InvoiceGetByIdApiResponse = InvoiceGetByIdResponse | InvoiceGetByIdErrorResponse;

// DELETE INVOICE BY ID
export interface InvoiceDeleteResponse {
    success: false;
    message: string;
}