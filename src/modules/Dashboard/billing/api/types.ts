export interface InvoiceService {
  _id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Patient {
  _id: string;
  fullName: string;
}

export interface Provider {
  _id: string;
  fullName: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  patientId: Patient;
  providerId: Provider;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  services: InvoiceService[];
  totalAmount: number;
  notes: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// POST REQUEST/RESPONSE INTERFACES
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

export type InvoicePostApiResponse = InvoicePostResponse | InvoicePostErrorResponse;

// GET ALL INVOICES
export interface InvoiceGetResponse {
  success: boolean;
  count: number;
  data: Invoice[];
}

export interface InvoiceGetErrorResponse {
  success: false;
  message: string;
  data: string;
}

export type InvoiceGetApiResponse = InvoiceGetResponse | InvoiceGetErrorResponse;

// GET INVOICE BY ID
export interface InvoiceGetByIdResponse {
  success: boolean;
  data: Invoice;
}

export interface InvoiceGetByIdErrorResponse {
  success: false;
  message: string;
  data: string;
}

export type InvoiceGetByIdApiResponse = InvoiceGetByIdResponse | InvoiceGetByIdErrorResponse;

// DELETE INVOICE
export interface InvoiceDeleteResponse {
  success: boolean;
  message: string;
}

export interface InvoiceDeleteErrorResponse {
  success: false;
  message: string;
  data?: string;
}

export type InvoiceDeleteApiResponse = InvoiceDeleteResponse | InvoiceDeleteErrorResponse;