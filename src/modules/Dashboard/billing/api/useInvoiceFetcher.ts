
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllInvoices } from "./slice";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";

export const useInvoiceFetcher = () => {
    const dispatch = useAppDispatch();
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
        allowedRoles: ['admin', 'staff'],
        dataLength: invoices?.length || 0,
        fetchAction: fetchAllInvoices,
        resourceName: 'Invoices'
    });
};
