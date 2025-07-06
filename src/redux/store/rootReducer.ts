import { combineReducers, UnknownAction } from "redux";

// Import Reducers
import authReducer, { logout } from "@/src/modules/Authentication/auth/api/slice"
import profileReducer from "@/src/modules/Authentication/profile/api/slice"
import billingReducer from "@/src/modules/Dashboard/billing/api/slice";
import appointmentReducer from "@/src/modules/Dashboard/appointments/api/slice";
import medicalRecordReducer from "@/src/modules/Dashboard/medicalRecords/api/slice";
import patientReducer from "@/src/modules/Dashboard/patients/api/slice";
import reportReducer from "@/src/modules/Dashboard/reports/api/slice";
import providerReducer from "@/src/modules/Dashboard/Provider/api/slice";
import dashboardReducer from "@/src/modules/Dashboard/dashboard/api/slice";
import systemUserReducer from "@/src/modules/Dashboard/(super-admin)/system-users/api/slice"

// Define the logout action type
const LOGOUT = 'auth/logout';

// Temporary placeholder reducer to avoid empty combineReducers
const placeholderReducer = (state = {}) => state;

const appReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    systemUsers: systemUserReducer,
    invoice: billingReducer,
    appointment: appointmentReducer,
    profile: profileReducer,
    medicalRecord: medicalRecordReducer,
    patients: patientReducer,
    reports: reportReducer,
    provider: providerReducer,
});

// Define the type for the combined state
type AppState = ReturnType<typeof appReducer>;

// Root reducer with logout handling
const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
    // Handle multiple logout scenarios
    const logoutActions = [
        'auth/logout',
        'auth/logoutSuccess',
        'auth/sessionExpired',
        logout.type
    ];

    if (logoutActions.includes(action.type)) {
        // Optional: Clear localStorage/sessionStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('persist:root');
        }

        // Complete state reset - pass undefined to reset all reducers to initial state
        state = undefined;
    }

    // Continue with the normal reducer flow
    return appReducer(state, action);

};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;