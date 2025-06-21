"use client"
import { useMemo } from 'react';
import { useAppSelector } from '../store/reduxHook';
import decodeJWTWithWebAPI from '@/src/utils/decodedToken';


export const useDecodedToken = () => {
    const token = useAppSelector(state => state.auth.token);
    
    return useMemo(() => {
        return token ? decodeJWTWithWebAPI(token) : null;
    }, [token]);
};