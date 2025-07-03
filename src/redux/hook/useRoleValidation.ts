'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/reduxHook';

export function useRoleValidation() {
    const { user, loginLoading, isAuthenticated, token } = useAppSelector(state => state.auth)
    const router = useRouter();
    const params = useParams();
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {

        if (loginLoading) {
            return;
        }

        // Clear boolean check for authentication
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        // Additional safety check for user data
        if (!user) {
            return; // Wait for user data to load
        }

        const roleFromUrl = params.role as string;
        const idFromUrl = params.dashboardId as string;

        // Check role mismatch
        if (user.role !== roleFromUrl) {
            const correctPath = `/${user.id}/${user.role}/dashboard`;
            router.push(correctPath);
            return;
        }

        // Check ID mismatch (users can only access their own dashboard)
        if (user.id !== idFromUrl) {
            const correctPath = `/${user.id}/${user.role}/dashboard`;
            router.push(correctPath);
            return;
        }

        // All validations passed
        setIsAuthorized(true);
        setIsValidating(false);
    }, [user, loginLoading, isAuthenticated, token, params, router]);

    return { isValidating, isAuthorized };
}