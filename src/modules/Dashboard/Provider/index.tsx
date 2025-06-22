"use client";

// Import components
import { useAppSelector } from "@/src/redux/store/reduxHook";
import { ProviderProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/provider/page";


export default function index({ dashboardId, role }: ProviderProps) {
    const {user} = useAppSelector(state => state.auth)


    return (
     <>repor</>
    )
}
