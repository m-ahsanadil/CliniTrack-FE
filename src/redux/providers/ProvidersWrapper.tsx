"use client";

import { FC, ReactNode } from "react";
import { ToastProvider } from "./ToastProvider";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "./contexts/auth-context";
import { GlobalUIProvider } from "./contexts/GlobalUIContext";

// import { ThemeProvider } from "./ThemeProvider";
// import { NextAuthProvider } from "./AuthProvider";


interface ProvidersWrapperProps {
    children: ReactNode;
}

export const ProvidersWrapper: FC<ProvidersWrapperProps> = ({ children }) => {
    return (
        <AuthProvider>
            <ReduxProvider>
                {/* <ThemeProvider>
                <NextAuthProvider> */}
                <GlobalUIProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </GlobalUIProvider >
                {/* </NextAuthProvider>
            </ThemeProvider> */}
            </ReduxProvider>
        </AuthProvider>
    )
}