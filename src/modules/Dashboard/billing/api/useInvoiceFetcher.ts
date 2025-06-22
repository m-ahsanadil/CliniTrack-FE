
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllInvoices } from "./slice";

export const useInvoiceFetcher = () => {
    const dispatch = useAppDispatch();
    const { invoices } = useAppSelector(state => state.invoice);

    useEffect(() => {
        if (invoices?.length === 0) {
            dispatch(fetchAllInvoices());
        }

        const handleFocus = () => {
            dispatch(fetchAllInvoices());
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);
};
