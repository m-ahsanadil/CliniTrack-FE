"use client";
import React, { FC, ReactNode } from 'react';
// import dynamic from 'next/dynamic';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
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
            <ToastContainer />
        </>
    );
};