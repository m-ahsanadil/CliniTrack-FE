import { ReportStatus } from "@/src/enum";

// Data filtering criteria for reports
interface DataFilters {
  startDate: string;
  endDate: string;
  status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
}

// Individual report record
export interface GetAllReports {
  _id: string;
  title: string;
  description: string;
  reportDate: string;
  reportType: string;
  generatedByUserId: string | null;
  dataFilters: DataFilters;
  status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API response wrapper
export interface ReportsGetAllResponse {
  success: boolean;
  data: GetAllReports[];
  count: number;
  message?: string;
}

// When sending a request to create/update a report
export interface ReportPostRequest {
  title: string;
  description: string;
  reportDate: string;
  reportType: string;
  generatedByUserId: string; // just the user ID (not full object)
  dataFilters: DataFilters;
  status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
  createdBy: string;
  updatedBy: string;
}

// API response for POST / PUT / GET by ID / DELETE
export interface ReportPostResponse {
  success: true;
  message: string;
  data: ReportPostRequest;
}

export interface ReportErrorPostResponse {
  success: false;
  message: string;
  data?: string;
}

export type ReportApiPostResponse = ReportPostResponse | ReportErrorPostResponse;
