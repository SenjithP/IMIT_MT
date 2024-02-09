import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../Slices/authenticationSlice";
import { apiSlice } from "../Slices/apiSlice";
const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
