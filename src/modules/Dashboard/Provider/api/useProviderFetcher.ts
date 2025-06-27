
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { fetchAllProviders } from "./slice";
import { useRoleBasedFetcher } from "@/src/redux/hook/useRoleBasedFetcher";
import { UserRole } from "@/src/enum";

export const useProviderFetcher = () => {
    const dispatch = useAppDispatch();
    const { provider } = useAppSelector(state => state.provider);

    // useEffect(() => {
    //     if (Providers?.length === 0) {
    //         dispatch(fetchAllProviders());
    //     }

    //     const handleFocus = () => {
    //         dispatch(fetchAllProviders());
    //     };

    //     window.addEventListener("focus", handleFocus);
    //     return () => window.removeEventListener("focus", handleFocus);
    // }, []);
    useRoleBasedFetcher({
        allowedRoles: [UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR],
        dataLength: provider?.length || 0,
        fetchAction: fetchAllProviders,
        resourceName: 'Providers'
    });
};
