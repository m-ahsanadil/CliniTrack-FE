import { useAppSelector } from "@/src/redux/store/reduxHook";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { fetchAllMedicalRecord } from "./slice";

export const useMedicalRecordsFetcher = () => {
    const { medicalRecords } = useAppSelector(state => state.medicalRecord);
    
    useRoleBasedFetcher({
        allowedRoles: ['admin', 'staff', 'doctor'],
        dataLength: medicalRecords.length,
        fetchAction: fetchAllMedicalRecord,
        resourceName: 'Medical Records'
    });
};