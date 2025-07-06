import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";
import { Role, fetchDashboardData } from "../slice";

export function useDashboardData(role: Role) {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData(role));
  }, [role, dispatch]);

  return { data, loading, error };
}
