
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllInvoices } from "./slice";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { UserRole } from "@/src/enum";

export const useInvoiceFetcher = () => {
    const { invoices } = useAppSelector(state => state.invoice);

    // useEffect(() => {
    //     if (invoices?.length === 0) {
    //         dispatch(fetchAllInvoices());
    //     }

    //     const handleFocus = () => {
    //         dispatch(fetchAllInvoices());
    //     };

    //     window.addEventListener("focus", handleFocus);
    //     return () => window.removeEventListener("focus", handleFocus);
    // }, []);
    useRoleBasedFetcher({
        allowedRoles: [UserRole.ADMIN, UserRole.STAFF],
        dataLength: invoices?.length || 0,
        fetchAction: fetchAllInvoices,
        resourceName: 'Invoices'
    });
};
