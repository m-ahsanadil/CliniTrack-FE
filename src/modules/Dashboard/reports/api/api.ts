import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import {
        ReportApiPostResponse,
        ReportPostRequest,
        ReportsGetAllResponse
} from "./types";

export const reportApi = {
        create: (reportData: ReportPostRequest): Promise<ReportApiPostResponse> => {
                return apiService.post(ENDPOINTS.REPORT.CREATE, reportData);
        },

        getAll: (): Promise<ReportsGetAllResponse> => {
                return apiService.get(ENDPOINTS.REPORT.GET_ALL);
        },

        getById: (id: string | number): Promise<ReportApiPostResponse> => {
                return apiService.get(ENDPOINTS.REPORT.GET_BY_ID(id));
        },

        update: (id: string | number, reportData: ReportPostRequest): Promise<ReportApiPostResponse> => {
                return apiService.put(ENDPOINTS.REPORT.UPDATE(id), reportData);
        },

        delete: (id: string | number): Promise<ReportApiPostResponse> => {
                return apiService.delete(ENDPOINTS.REPORT.DELETE(id));
        }
};