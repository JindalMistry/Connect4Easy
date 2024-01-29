import { createSlice } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
const SOCKET_URL = "ws://localhost:8080/ws";
const SOCKJS_URL = "http://localhost:8080/ws";
var stompClient = null;

const initialState = {
    token: "",
    username: "",
    user_id: "",
    socketResponse: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.user_id = action.payload.user_id;
        },
        clearSocketResponse: (state, action) => {
            state.socketResponse = null;
        },
        setSocketResponse: (state, action) => {
            state.socketResponse = action.payload.res;
        }
    }
});

export const UserInfo = (state) => state.auth;
export const { setUser, clearSocketResponse, setSocketResponse } = authSlice.actions;
export default authSlice.reducer;