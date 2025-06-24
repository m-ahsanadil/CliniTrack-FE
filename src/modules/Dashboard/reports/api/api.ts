import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import { ReportApiResponse, ReportRequest, ReportsGetResponse } from "./types";

export const reportApi = {
        create: (reportData: ReportRequest): Promise<ReportApiResponse> => {
                return apiService.post(ENDPOINTS.REPORT.CREATE, reportData);
        },

        getAll: (): Promise<ReportsGetResponse> => {
                return apiService.get(ENDPOINTS.REPORT.GET_ALL);
        },

        getById: (id: string | number): Promise<ReportApiResponse> => {
                return apiService.get(ENDPOINTS.REPORT.GET_BY_ID(id));
        },

        update: (id: string | number, reportData: ReportRequest): Promise<ReportApiResponse> => {
                return apiService.put(ENDPOINTS.REPORT.UPDATE(id), reportData);
        },

        delete: (id: string | number): Promise<ReportApiResponse> => {
                return apiService.delete(ENDPOINTS.REPORT.DELETE(id));
        }
};
