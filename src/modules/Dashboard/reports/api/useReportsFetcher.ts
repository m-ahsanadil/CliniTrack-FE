
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllReports } from "./slice";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { UserRole } from "@/src/enum";

export const useReportsFetcher = () => {
    const { reports } = useAppSelector(state => state.reports);

    // useEffect(() => {
    //     if (reports.length === 0) {
    //         dispatch(fetchAllReports());
    //     }

    //     const handleFocus = () => {
    //         dispatch(fetchAllReports());
    //     };

    //     window.addEventListener("focus", handleFocus);
    //     return () => window.removeEventListener("focus", handleFocus);
    // }, []);
    useRoleBasedFetcher({
        allowedRoles: [UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR],
        dataLength: reports.length,
        fetchAction: fetchAllReports,
        resourceName: 'Reports'
    });
};
