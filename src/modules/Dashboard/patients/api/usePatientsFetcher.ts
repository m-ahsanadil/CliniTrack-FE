
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllPatients } from "./slice";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { UserRole } from "@/src/enum";

export const usePatientsFetcher = () => {
    const { patients, count } = useAppSelector(state => state.patients);

    // useEffect(() => {
    //     if (patients.length === 0) {
    //         dispatch(fetchAllPatients());
    //     }

    //     const handleFocus = () => {
    //         dispatch(fetchAllPatients());
    //     };

    //     window.addEventListener("focus", handleFocus);
    //     return () => window.removeEventListener("focus", handleFocus);
    // }, []);
    useRoleBasedFetcher({
        allowedRoles: [UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR],
        dataLength: patients.length,
        fetchAction: fetchAllPatients,
        resourceName: 'Patients'
    });
};
