
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllReports } from "./slice";

export const useReportsFetcher = () => {
    const dispatch = useAppDispatch();
    const { reports } = useAppSelector(state => state.reports);

    useEffect(() => {
        if (reports.length === 0) {
            dispatch(fetchAllReports());
        }

        const handleFocus = () => {
            dispatch(fetchAllReports());
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);
};
