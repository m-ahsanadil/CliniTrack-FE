import { combineReducers, UnknownAction } from "redux";

// Import Reducers
// TODO: Import your actual reducers here
// import authReducer from './auth/authSlice';
// import videoReducer from './video/videoSlice';

// Temporary placeholder reducer to avoid empty combineReducers
const placeholderReducer = (state = {}) => state;

const appReducer = combineReducers({
    // TODO: Replace placeholder with your actual reducers
    placeholder: placeholderReducer,
    // auth: authReducer,
    // videos: videoReducer,
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