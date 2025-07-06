import { ReportStatus } from "./enum";

// User information embedded in reports
interface User {
  _id: string;
  username: string;
  email: string;
}

// Data filtering criteria for reports
interface DataFilters {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
  status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
}

// Individual report record
export interface Report {
  _id: string;
  title: string;
  description: string;
  reportDate: string;      // ISO datetime string
  reportType: string;
  generatedByUserId: User | null;
  dataFilters: DataFilters;
  status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
  createdBy: string;
  updatedBy: string;
  createdAt: string;       // ISO datetime string
  updatedAt: string;       // ISO datetime string
  __v: number;
}

// API response wrapper
export interface ReportsGetResponse {
  success: boolean;
  data: Report[];
  count: number;
  message?: string;
}

// When sending a request to create/update a report
export interface ReportRequest {
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
  data: Report;
}

export interface ReportErrorResponse {
  success: false;
  message: string;
  data?: string;
}

export type ReportApiResponse = ReportPostResponse | ReportErrorResponse;
