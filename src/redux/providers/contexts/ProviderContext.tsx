"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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


type ProviderContextType = {
    // Data States
    provider: Provider | null;
    setProvider: (val: Provider | null) => void;

    // ModalStates
    providerFormOpen: boolean;
    setProviderFormOpen: (val: boolean) => void;

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

    // states
    const [provider, setProvider] = useState<Provider | null>(null);
    const [providerFormOpen, setProviderFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const filteredProvider = providers;

    const resetAllProviderFlags = () => {
        dispatch(clearCreateSuccess());
        dispatch(clearUpdateSuccess());
        dispatch(clearUpdateError());
        dispatch(clearDeleteError());
        dispatch(clearCreateError());
    };

    const handleAddProvider = () => {
        resetAllProviderFlags();

        setProvider(null);
        setIsEditing(false);
        setProviderFormOpen(true);
    };

    const handleEditProvider = (provider: Provider) => {
        resetAllProviderFlags();

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