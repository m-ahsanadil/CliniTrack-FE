
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { fetchAllAppointments } from "./slice";

export const useAppointmentsFetcher = () => {
  const dispatch = useAppDispatch();
  const { appointments } = useAppSelector(state => state.appointment);

  useEffect(() => {
    if (appointments.length === 0) {
      dispatch(fetchAllAppointments());
    }

    const handleFocus = () => {
      dispatch(fetchAllAppointments());
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);
};
