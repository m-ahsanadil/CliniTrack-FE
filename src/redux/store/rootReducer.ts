import { combineReducers, UnknownAction } from "redux";

// Import Reducers
import authReducer from "@/src/modules/Authentication/auth/api/slice"
import doctorReducer from "@/src/modules/Dashboard/doctor/api/slice";
import billingReducer from "@/src/modules/Dashboard/billing/api/slice";
import appointmentReducer from "@/src/modules/Dashboard/appointments/api/slice";
import medicalRecordReducer from "@/src/modules/Dashboard/medicalRecords/api/slice";
import patientReducer from "@/src/modules/Dashboard/patients/api/slice";
import reportReducer from "@/src/modules/Dashboard/reports/api/slice";




// Temporary placeholder reducer to avoid empty combineReducers
const placeholderReducer = (state = {}) => state;

const appReducer = combineReducers({
    auth: authReducer,
    doctor: doctorReducer,
    invoice: billingReducer,
    appointment: appointmentReducer,
    medicalRecord: medicalRecordReducer,
    patients: patientReducer,
    reports: reportReducer,
});

// Define the type for the combined state
type AppState = ReturnType<typeof appReducer>;

// Root reducer with logout handling
const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
    // When logout action is dispatched, reset the state
    // if (action.type === LOGOUT) {
    //     state = undefined;
    // }

    // Continue with the normal reducer flow
    return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;