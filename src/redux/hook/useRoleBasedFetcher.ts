import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect } from "react";

type UserRole = 'admin' | 'staff' | 'doctor';

interface UseRoleBasedFetcherProps {
    allowedRoles: UserRole[];
    dataLength: number;
    fetchAction: () => any;
    resourceName: string;
}

export const useRoleBasedFetcher = ({
    allowedRoles,
    dataLength,
    fetchAction,
    resourceName
}: UseRoleBasedFetcherProps) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (user?.role && allowedRoles.includes(user.role as UserRole)) {
            if (dataLength === 0) {
                dispatch(fetchAction());
            }

            const handleFocus = () => {
                dispatch(fetchAction());
                // if (Date.now() - lastFetchedAt > 60 * 1000) {
                //     dispatch(fetchAction());
                // }
            };

            window.addEventListener("focus", handleFocus);
            return () => window.removeEventListener("focus", handleFocus);
        } else {
            console.log(`${resourceName} access denied for role: ${user?.role}`);
        }
    }, [user?.role, dataLength, dispatch, fetchAction, allowedRoles, resourceName]);
};