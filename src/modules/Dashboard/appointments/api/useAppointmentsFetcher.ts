
import {  useAppSelector } from "@/src/redux/store/reduxHook";
import { fetchAllAppointments } from "./slice";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { UserRole } from "@/src/enum";

export const useAppointmentsFetcher = () => {
  // const dispatch = useAppDispatch();
  const { appointments } = useAppSelector(state => state.appointment);

  // useEffect(() => {
  //   if (appointments.length === 0) {
  //     dispatch(fetchAllAppointments());
  //   }

  //   const handleFocus = () => {
  //     dispatch(fetchAllAppointments());
  //   };

  //   window.addEventListener("focus", handleFocus);
  //   return () => window.removeEventListener("focus", handleFocus);
  // }, []);
  useRoleBasedFetcher({
    allowedRoles: [UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR],
    dataLength: appointments.length,
    fetchAction: fetchAllAppointments,
    resourceName: 'Medical Records'
  });
};
