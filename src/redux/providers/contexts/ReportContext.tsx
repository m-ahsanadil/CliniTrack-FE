"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { GetAllReports, ReportPostRequest } from "@/src/modules/Dashboard/reports/api/types";
import { clearError, createReport, deleteReport, fetchAllReports, updateReport } from "@/src/modules/Dashboard/reports/api/slice";
import { GetUserProfile } from "@/src/modules/Authentication/profile/api/types";
import { fetchProfile } from "@/src/modules/Authentication/profile/api/slice";

type ReportContextType = {
    // Data States
    report: GetAllReports | null;
    setReport: (val: GetAllReports | null) => void;
    profile: GetUserProfile | null;

    // ModalStates
    reportFormOpen: boolean;
    setReportFormOpen: (val: boolean) => void;

    //Editing states
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;

    // Data fetching status
    isDataFetched: boolean;
    isDataLoading: boolean;

    // Loading states
    loading: boolean;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    error: string | null;

    // Filtered
    filteredReport: GetAllReports[];

    // Reports Record CRUD
    handleAddReport: () => void;
    handleEditReport: (report: GetAllReports) => void;
    handleSaveReport: (reportData: ReportPostRequest, onSuccess?: () => void) => void;
    handleDeleteReport: (reportId: string) => void;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const {
        reports,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        error
    } = useAppSelector(state => state.reports);
    const { profile, loading: profileLoading } = useAppSelector(state => state.profile);

    // states
    const [report, setReport] = useState<GetAllReports | null>(null);
    const [reportFormOpen, setReportFormOpen] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState(false);

    const filteredReport = useMemo(() => reports, [reports]);

    // Calculate if data is still loading
    const isDataLoading = profileLoading;

    // Fetch required data when context is first loaded
    useEffect(() => {
        const fetchRequiredData = async () => {
            if (!isDataFetched) {
                try {
                    await Promise.all([
                        dispatch(fetchProfile()),
                    ]);
                    setIsDataFetched(true);
                } catch (error) {
                    console.error("Error fetching required data:", error);
                }
            }
        };

        fetchRequiredData();
    }, [dispatch, isDataFetched]);

    // Re-fetch data if it's not available or if explicitly requested
    const refetchData = async () => {
        try {
            await Promise.all([
                dispatch(fetchProfile()),
            ]);
            setIsDataFetched(true);
        } catch (error) {
            console.error("Error refetching data:", error);
        }
    };

    const resetAllReportFlags = () => {
        dispatch(clearError());
    };

    const handleAddReport = async () => {
        resetAllReportFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile) {
            await refetchData();
        }

        setReport(null);
        setIsEditing(false);
        setReportFormOpen(true);
    };

    const handleEditReport = async (report: GetAllReports) => {
        resetAllReportFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile) {
            await refetchData();
        }

        setReport(report);
        setIsEditing(true);
        setReportFormOpen(true);
    };

    const handleSaveReport = async (reportData: ReportPostRequest, onSuccess?: () => void) => {
        try {
            resetAllReportFlags();
            let resultAction;

            if (isEditing && report?._id) {
                resultAction = await dispatch(updateReport({ id: report._id, reportData }));
            } else {
                resultAction = await dispatch(createReport(reportData));
            }

            if (createReport.fulfilled.match(resultAction) || updateReport.fulfilled.match(resultAction)) {
                // Refresh the providers list
                await dispatch(fetchAllReports());

                // ✅ Reset modal state
                setReport(null);
                setIsEditing(false);
                setReportFormOpen(false);

                // Call optional success callback
                if (onSuccess) onSuccess();
            } else {
                // Handle the rejected case
                console.error("Operation failed:", resultAction.payload);
            }

        } catch (err) {
            console.error("Error in context handleReport", err);
        }
    };

    const handleDeleteReport = async (reportId: string) => {
        try {
            const resultAction = await dispatch(deleteReport(reportId));

            if (deleteReport.fulfilled.match(resultAction)) {
                // Optionally refresh the list (though the reducer should handle this)
                dispatch(clearError());
            }
        } catch (err) {
            console.error("Error deleting report:", err);
        }
    };


    return (
        <ReportContext.Provider
            value={{
                report,
                setReport,
                profile,
                isDataFetched,
                isDataLoading,
                isEditing,
                setIsEditing,
                loading,
                createLoading,
                updateLoading,
                deleteLoading,
                error,
                reportFormOpen,
                setReportFormOpen,
                filteredReport,

                // CRUD operations
                handleAddReport,
                handleDeleteReport,
                handleEditReport,
                handleSaveReport,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) throw new Error("useReport must be used within a ReportProvider");
    return context;
};