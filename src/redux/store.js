import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import navigatorSlice from "./navigatorSlice.js";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import empresasReducer from "./empresasSlice";
import configuracionComisionesReducer from "./configuracionComisionesSlice";
import extraccionReducer from "./extraccionSlice";
import calculoComisionesReducer from "./calculoComisiones";
import estadisticasSlice from "./estadisticasSlice.js";
import sizeStoreReducer from "./sizeStoreSlice";
import configSelloutReducer from "./configSelloutSlice";
import selloutDatosReducer from "./selloutDatosSlic";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth"],
};
const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    navigator: navigatorSlice,
    users: userReducer,
    empresa: empresasReducer,
    configuracionComisiones: configuracionComisionesReducer,
    extraccion: extraccionReducer,
    calculoComisiones: calculoComisionesReducer,
    estadisticas: estadisticasSlice,
    sizeStore: sizeStoreReducer,
    configSellout: configSelloutReducer,
    selloutDatos: selloutDatosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
