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
  status: string;   
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
  status: string;          
  createdBy: string;       
  updatedBy: string;       
  createdAt: string;       // ISO datetime string
  updatedAt: string;       // ISO datetime string
  __v: number;            
}

// API response wrapper
export interface ReportsGetResponse {
  success: boolean;
  count: number;
  data?: Report[];
}