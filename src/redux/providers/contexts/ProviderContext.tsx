"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { Provider, ProviderRequest } from "@/src/modules/Dashboard/Provider/api/types";
import {
    clearDeleteError,
    clearCreateError,
    clearUpdateError,
    resetSuccess,
    createProvider,
    deleteProvider,
    fetchAllProviders,
    updateProvider,
    clearCreateSuccess,
    clearUpdateSuccess
} from "@/src/modules/Dashboard/Provider/api/slice";
import { fetchProfile } from "@/src/modules/Authentication/profile/api/slice";
import { GetUserProfile } from "@/src/modules/Authentication/profile/api/types";


type ProviderContextType = {
    // Data States
    provider: Provider | null;
    setProvider: (val: Provider | null) => void;
    profile: GetUserProfile | null;

    // ModalStates
    providerFormOpen: boolean;
    setProviderFormOpen: (val: boolean) => void;

    // Data fetching status
    isDataFetched: boolean;
    isDataLoading: boolean;

    //Editing states
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;

    // Filtered
    filteredProvider: Provider[];

    // Medical Record CRUD
    handleAddProvider: () => void;
    handleEditProvider: (provider: Provider) => void;
    handleSaveProvider: (providerData: ProviderRequest, onSuccess?: () => void) => void;
    handleDeleteProvider: (providerId: string) => void;
};

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const providers = useAppSelector(state => state.provider.providers)
    const { profile, loading: profileLoading } = useAppSelector(state => state.profile);

    // states
    const [provider, setProvider] = useState<Provider | null>(null);
    const [providerFormOpen, setProviderFormOpen] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState(false);

    const filteredProvider = useMemo(() => providers, [providers]);

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

    const resetAllProviderFlags = () => {
        dispatch(clearCreateSuccess());
        dispatch(clearUpdateSuccess());
        dispatch(clearUpdateError());
        dispatch(clearDeleteError());
        dispatch(clearCreateError());
    };

    const handleAddProvider = async () => {
        resetAllProviderFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile) {
            await refetchData();
        }

        setProvider(null);
        setIsEditing(false);
        setProviderFormOpen(true);
    };

    const handleEditProvider = async (provider: Provider) => {
        resetAllProviderFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile) {
            await refetchData();
        }

        setProvider(provider);
        setIsEditing(true);
        setProviderFormOpen(true);
    };

    const handleSaveProvider = async (providerData: ProviderRequest, onSuccess?: () => void) => {
        try {
            resetAllProviderFlags();
            let resultAction;

            if (isEditing && provider?._id) {
                resultAction = await dispatch(updateProvider({ id: provider._id, providerData: providerData }));
            } else {
                resultAction = await dispatch(createProvider(providerData));
            }

            if (createProvider.fulfilled.match(resultAction) || updateProvider.fulfilled.match(resultAction)) {
                // Refresh the providers list
                await dispatch(fetchAllProviders());

                // ✅ Reset modal state
                setProvider(null);
                setIsEditing(false);
                setProviderFormOpen(false);

                // Call optional success callback
                if (onSuccess) onSuccess();
            } else {
                // Handle the rejected case
                console.error("Operation failed:", resultAction.payload);
            }

        } catch (err) {
            console.error("Error in context handleProvider", err);
        }
    };

    const handleDeleteProvider = async (providerId: string) => {
        try {
            const resultAction = await dispatch(deleteProvider(providerId));

            if (deleteProvider.fulfilled.match(resultAction)) {
                // Optionally refresh the list (though the reducer should handle this)
                dispatch(clearDeleteError());
            }
        } catch (err) {
            console.error("Error deleting provider:", err);
        }
    };


    return (
        <ProviderContext.Provider
            value={{
                provider,
                setProvider,
                isEditing,
                isDataFetched,
                isDataLoading,
                profile,
                setIsEditing,
                providerFormOpen,
                setProviderFormOpen,
                filteredProvider,

                // CRUD operations
                handleAddProvider,
                handleDeleteProvider,
                handleEditProvider,
                handleSaveProvider,
            }}
        >
            {children}
        </ProviderContext.Provider>
    );
};

export const useProvider = () => {
    const context = useContext(ProviderContext);
    if (!context) throw new Error("useProvider must be used within a DoctorProvider");
    return context;
};