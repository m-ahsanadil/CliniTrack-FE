"use client";

import { FC, ReactNode } from "react";
import { GlobalUIProvider } from "./GlobalUIContext"
import { MedicalRecordProvider } from "./MedicalRecordContext";
import { PatientProvider } from "./PatientContext";
import { DoctorProvider } from "./ProviderContext";


interface ContextWrapperProps {
    children: ReactNode;
}

export const ContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
    return (
        <GlobalUIProvider>
            <PatientProvider>
                <DoctorProvider>
                    <MedicalRecordProvider>
                        {children}
                    </MedicalRecordProvider>
                </DoctorProvider>
            </PatientProvider>
        </GlobalUIProvider >
    )
}