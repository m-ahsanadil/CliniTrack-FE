import { UserRole } from "@/src/enum";
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect, useCallback, useRef } from "react";

interface UseRoleBasedFetcherProps {
    allowedRoles: UserRole[];
    dataLength: number;
    fetchAction: () => any;
    resourceName: string;
    // Optional configurations
    refetchOnFocus?: boolean;
    refetchInterval?: number; // in milliseconds
    maxRetries?: number;
}

export const useRoleBasedFetcher = ({
    allowedRoles,
    dataLength,
    fetchAction,
    resourceName,
    refetchOnFocus = true,
    refetchInterval = 5 * 60 * 1000, // 5 minutes default
    maxRetries = 3
}: UseRoleBasedFetcherProps) => {
    const dispatch = useAppDispatch();
    const { user, loginLoading: authLoading } = useAppSelector(state => state.auth);

    // Use refs to track state without causing re-renders
    const lastFetchedAt = useRef<number>(0);
    const retryCount = useRef<number>(0);
    const isFetching = useRef<boolean>(false);
    const hasInitialFetch = useRef<boolean>(false);

    // Stable fetch function
    const performFetch = useCallback(async (reason: string = 'unknown') => {
        // Prevent concurrent fetches
        if (isFetching.current) {
            console.log(`${resourceName}: Fetch already in progress, skipping (${reason})`);
            return;
        }

        // Check if user has permission
        if (!user?.role || !allowedRoles.includes(user.role as UserRole)) {
            console.log(`${resourceName}: Access denied for role: ${user?.role}`);
            return;
        }

        try {
            isFetching.current = true;
            console.log(`${resourceName}: Fetching data (${reason})`);

            await dispatch(fetchAction());

            lastFetchedAt.current = Date.now();
            retryCount.current = 0; // Reset retry count on success
            hasInitialFetch.current = true;

        } catch (error) {
            console.error(`${resourceName}: Fetch failed (${reason}):`, error);

            // Retry logic
            if (retryCount.current < maxRetries) {
                retryCount.current++;
                console.log(`${resourceName}: Retrying... (${retryCount.current}/${maxRetries})`);

                // Exponential backoff: 1s, 2s, 4s
                const delay = Math.pow(2, retryCount.current - 1) * 1000;
                setTimeout(() => performFetch(`retry-${retryCount.current}`), delay);
            }
        } finally {
            isFetching.current = false;
        }
    }, [dispatch, fetchAction, user?.role, allowedRoles, resourceName, maxRetries]);

    // Focus handler with debouncing
    const handleFocus = useCallback(() => {
        if (!refetchOnFocus) return;

        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchedAt.current;

        if (timeSinceLastFetch > refetchInterval) {
            performFetch('window-focus');
        } else {
            console.log(`${resourceName}: Skipping focus fetch (${Math.round(timeSinceLastFetch / 1000)}s since last fetch)`);
        }
    }, [performFetch, refetchInterval, refetchOnFocus, resourceName]);

    // Main effect for initial fetch and setup
    useEffect(() => {
        // Don't do anything if auth is still loading
        if (authLoading) {
            console.log(`${resourceName}: Waiting for auth to complete...`);
            return;
        }

        // Check permissions
        if (!user?.role || !allowedRoles.includes(user.role as UserRole)) {
            console.log(`${resourceName}: User doesn't have required role. Required: ${allowedRoles.join(', ')}, Current: ${user?.role || 'none'}`);
            return;
        }

        // Initial fetch - only if we haven't fetched before and data is empty
        if (!hasInitialFetch.current && dataLength === 0) {
            performFetch('initial-load');
        }

        // Set up focus listener
        if (refetchOnFocus) {
            window.addEventListener("focus", handleFocus);
            return () => {
                window.removeEventListener("focus", handleFocus);
            };
        }
    }, [
        user?.role,
        authLoading,
        dataLength,
        performFetch,
        handleFocus,
        allowedRoles,
        refetchOnFocus,
        resourceName
    ]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Reset refs on unmount
            hasInitialFetch.current = false;
            isFetching.current = false;
            retryCount.current = 0;
        };
    }, []);

    // Return useful state for debugging
    return {
        lastFetchedAt: lastFetchedAt.current,
        isFetching: isFetching.current,
        hasInitialFetch: hasInitialFetch.current,
        // Manual refetch function
        refetch: () => performFetch('manual-refetch')
    };
};