import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { InvoiceRequest, InvoiceApiResponse } from "./types";

export const invoiceApi = {
  getAll: (): Promise<InvoiceApiResponse> => apiService.get(ENDPOINTS.INVOICE.GET_ALL),
  getById: (id: string | number): Promise<InvoiceApiResponse> => apiService.get(ENDPOINTS.INVOICE.GET_BY_ID(id)),
  create: (payload: InvoiceRequest): Promise<InvoiceApiResponse> => apiService.post(ENDPOINTS.INVOICE.CREATE, payload),
  update: (id: string | number, payload: InvoiceRequest): Promise<InvoiceApiResponse> => apiService.put(ENDPOINTS.INVOICE.UPDATE(id), payload),
  delete: (id: string | number): Promise<InvoiceApiResponse> => apiService.delete(ENDPOINTS.INVOICE.DELETE(id)),
  markAsPaid: (id: string | number): Promise<InvoiceApiResponse> => apiService.patch(ENDPOINTS.INVOICE.MARK_PAID(id)),
};