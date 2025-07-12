"use client";

import { FC, ReactNode } from "react";
import { GlobalUIProvider } from "./GlobalUIContext"
import { MedicalRecordProvider } from "./MedicalRecordContext";
import { PatientProvider } from "./PatientContext";
import { DoctorProvider } from "./ProviderContext";
import { AppointmentProvider } from "./AppointmentContext";
import { ReportProvider } from "./ReportContext";


interface ContextWrapperProps {
    children: ReactNode;
}

export const ContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
    return (
        <GlobalUIProvider>
            <PatientProvider>
                <DoctorProvider>
                    <MedicalRecordProvider>
                        <AppointmentProvider>
                            <ReportProvider>
                                {children}
                            </ReportProvider>
                        </AppointmentProvider>
                    </MedicalRecordProvider>
                </DoctorProvider>
            </PatientProvider>
        </GlobalUIProvider >
    )
}