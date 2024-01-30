import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import connectSlice from "./connectSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        connect: connectSlice
    }
});

export default store;