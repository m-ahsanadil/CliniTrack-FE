import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";



// import reduxStorage from "./storage";
import { REDUX_PERSIST_KEY } from "../constants";
import rootReducer from "./rootReducer";
import { Storage } from "./ssrStorage";

const persistConfig = {
    key: REDUX_PERSIST_KEY,
    storage: Storage,
    whitelist: ["auth", 'doctor', 'invoice'],
    blacklist: [],
    debug: false,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // serializableCheck: false,
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
});


export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;