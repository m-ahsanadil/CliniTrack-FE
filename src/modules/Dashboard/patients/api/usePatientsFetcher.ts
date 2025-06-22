
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllPatients } from "./slice";

export const usePatientsFetcher = () => {
    const dispatch = useAppDispatch();
    const { patients } = useAppSelector(state => state.patients);

    useEffect(() => {
        if (patients.length === 0) {
            dispatch(fetchAllPatients());
        }

        const handleFocus = () => {
            dispatch(fetchAllPatients());
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);
};
