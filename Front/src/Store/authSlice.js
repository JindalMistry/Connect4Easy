import { createSlice } from "@reduxjs/toolkit";

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
    },
    resetAuthSlice: (state, action) => {
      state.token = "";
      state.username = "";
      state.user_id = "";
      state.socketResponse = null;
    },
  },
});

export const UserInfo = (state) => state.auth;
export const { setUser, clearSocketResponse, setSocketResponse, resetAuthSlice } =
  authSlice.actions;
export default authSlice.reducer;
