import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import { ReportsGetResponse } from "./types";

export const reportApi = {
        // Create a new Report
        createReport: (reportData: ReportRequest): Promise<ReportApiResponse> => {
                return apiService.post(ENDPOINTS.REPORT.CREATE, reportData);
        },

        // Get all Report
        getAllReport: (): Promise<ReportsGetResponse> => {
                return apiService.get(ENDPOINTS.REPORT.GET_ALL);
        },

        // Get a single Report by ID
        getReportById: (id: string | number): Promise<ReportApiResponse> => {
                return apiService.get(ENDPOINTS.REPORT.GET_BY_ID(id));
        },

        // Update Report by ID
        updateReport: (
                id: string | number,
                reportData: ReportRequest
        ): Promise<ReportApiResponse> => {
                return apiService.put(ENDPOINTS.REPORT.UPDATE(id), reportData);
        },

        // Delete Report by ID
        deleteReport: (id: string | number): Promise<ReportApiResponse> => {
                return apiService.delete(ENDPOINTS.REPORT.DELETE(id));
        }
};



// export const reportApi = {
//         getAll: () => apiService.get(ENDPOINTS.REPORT.GET_ALL),
//         getById: (id: string | number) => apiService.get(ENDPOINTS.REPORT.GET_BY_ID(id)),
//         create: (payload: unknown) => apiService.post(ENDPOINTS.REPORT.CREATE, payload),
//         update: (id: string | number, payload: unknown) => apiService.put(ENDPOINTS.REPORT.UPDATE(id), payload),
//         delete: (id: string | number) => apiService.delete(ENDPOINTS.REPORT.DELETE(id)),
// };