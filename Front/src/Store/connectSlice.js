import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeNotifications: 0,
  notifications: [],
};

const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    updateActiveNotification: (state, action) => {
      state.activeNotifications = action.payload;
    },
    markAsRead: (state, action) => {
      let temp = JSON.parse(JSON.stringify(state.notifications));
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].noti_id === action.payload.noti_id) {
          temp[i].IsRead = true;
          break;
        }
      }
      state.activeNotifications -= 1;
      state.notifications = temp;
    },
    insertNotification: (state, action) => {
      let noti = action.payload;
      let temp = [];
      temp.push(noti);
      for (let i = 0; i < state.notifications.length; i++) {
        temp.push(state.notifications[i]);
      }
      state.notifications = temp;
      state.activeNotifications += 1;
    },
    deleteNotification: (state, action) => {
      let temp = JSON.parse(JSON.stringify(state.notifications));
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].notification_id === action.payload.noti_id) {
          temp.splice(i, 1);
          break;
        }
      }
      state.notifications = temp;
      state.activeNotifications -= 1;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    resetConnectSlice: (state, action) => {
      state.activeNotifications = 0;
      state.notifications = [];
    },
  },
});

export const ConnectInfo = (state) => state.connect;
export const {
  setNotifications,
  insertNotification,
  markAsRead,
  updateActiveNotification,
  deleteNotification,
  resetConnectSlice,
} = connectSlice.actions;
export default connectSlice.reducer;
