import { useAppSelector } from "@/src/redux/store/reduxHook";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { fetchAllMedicalRecord } from "./slice";
import { UserRole } from "@/src/enum";

export const useMedicalRecordsFetcher = () => {
    const { medicalRecords } = useAppSelector(state => state.medicalRecord);
    
    useRoleBasedFetcher({
        allowedRoles: [UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR],
        dataLength: medicalRecords.length,
        fetchAction: fetchAllMedicalRecord,
        resourceName: 'Medical Records'
    });
};