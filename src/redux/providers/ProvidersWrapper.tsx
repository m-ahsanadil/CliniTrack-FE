"use client";

import { FC, ReactNode } from "react";
import { ToastProvider } from "./ToastProvider";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "./contexts/auth-context";
import { GlobalUIProvider } from "./contexts/GlobalUIContext";
import { MedicalRecordProvider } from "./contexts/MedicalRecordContext";
import { ContextWrapper } from "./contexts";

// import { ThemeProvider } from "./ThemeProvider";
// import { NextAuthProvider } from "./AuthProvider";


interface ProvidersWrapperProps {
    children: ReactNode;
}

export const ProvidersWrapper: FC<ProvidersWrapperProps> = ({ children }) => {
    return (
        <AuthProvider>
            <ReduxProvider>
                <ContextWrapper>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </ContextWrapper>
            </ReduxProvider>
        </AuthProvider>
    )
}