import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { InvoicePostApiResponse, InvoicePostRequest } from "./types";

export const invoiceApi = {
  getAll: (): Promise<InvoicePostApiResponse> => apiService.get(ENDPOINTS.INVOICE.GET_ALL),
  getById: (id: string | number): Promise<InvoicePostApiResponse> => apiService.get(ENDPOINTS.INVOICE.GET_BY_ID(id)),
  create: (payload: InvoicePostRequest): Promise<InvoicePostApiResponse> => apiService.post(ENDPOINTS.INVOICE.CREATE, payload),
  update: (id: string | number, payload: InvoicePostRequest): Promise<InvoicePostApiResponse> => apiService.put(ENDPOINTS.INVOICE.UPDATE(id), payload),
  delete: (id: string | number): Promise<InvoicePostApiResponse> => apiService.delete(ENDPOINTS.INVOICE.DELETE(id)),
  markAsPaid: (id: string | number): Promise<InvoicePostApiResponse> => apiService.patch(ENDPOINTS.INVOICE.MARK_PAID(id)),
};