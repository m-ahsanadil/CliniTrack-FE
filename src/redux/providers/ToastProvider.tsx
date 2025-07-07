"use client";
import { Toaster } from '@/components/ui/toaster';
import React, { FC, ReactNode } from 'react';
// import dynamic from 'next/dynamic';
import { ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface ToastProviderProps extends ToastContainerProps {
    children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({
    children,

}) => {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
};