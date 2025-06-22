"use client";

// Import components
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext";
import { useAppSelector } from "@/src/redux/store/reduxHook";
import { ReportsProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/reports/page";


export default function index({ dashboardId, role }: ReportsProps) {
    const {user} = useAppSelector(state => state.auth)


    return (
     <>repor</>
    )
}
