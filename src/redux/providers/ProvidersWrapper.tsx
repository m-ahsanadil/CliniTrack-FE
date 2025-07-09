"use client";

import { FC, ReactNode } from "react";
import { ToastProvider } from "./ToastProvider";
import ReduxProvider from "./ReduxProvider";
import { GlobalUIProvider } from "./contexts/GlobalUIContext";
import { ContextWrapper } from "./contexts";



interface ProvidersWrapperProps {
    children: ReactNode;
}

export const ProvidersWrapper: FC<ProvidersWrapperProps> = ({ children }) => {
    return (
        <ReduxProvider>
            <ContextWrapper>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ContextWrapper>
        </ReduxProvider>
    )
}