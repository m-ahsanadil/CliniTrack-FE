import { useEffect, useState } from "react";
import { Admin, AdminGetApiResponse, Doctor, DoctorGetApiResponse, Staff, StaffGetApiResponse, SuperAdmin, SuperAdminGetApiResponse } from "../types";
import { dashboardApi } from "../api";
import { UserRole } from "@/src/enum";


type Role = UserRole.ADMIN | UserRole.STAFF | UserRole.DOCTOR | UserRole.SUPER_ADMIN;
type DashboardApiResponse = AdminGetApiResponse | StaffGetApiResponse | DoctorGetApiResponse | SuperAdminGetApiResponse;
type DashboardData = Admin | Staff | Doctor | SuperAdmin;

export function useDashboardData(role: Role) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let fetchFn: () => Promise<DashboardApiResponse>;

        switch (role) {
            case UserRole.SUPER_ADMIN:
                fetchFn = dashboardApi.getSuperAdmin;
                break;
            case UserRole.ADMIN:
                fetchFn = dashboardApi.getAdmin;
                break;
            case UserRole.STAFF:
                fetchFn = dashboardApi.getStaff;
                break;
            case UserRole.DOCTOR:
                fetchFn = dashboardApi.getDoctor;
                break;
            default:
                setError("Invalid role");
                setLoading(false);
                return;
        }

        fetchFn()
            .then((res) => {
                if (res.success) {
                    setData(res.data);
                } else {
                    setError(res.message || "Unknown error");
                }
            })
            .catch((err) => {
                setError("Failed to fetch dashboard data");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [role]);

    return { data, loading, error };
}
