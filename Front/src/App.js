import "react-toastify/dist/ReactToastify.css";
import "./Css/toastify.css";
import "./Css/login-page.css";
import "./Css/global.css";
import "./Css/enter-otp.css";
import "./Css/home.css";
import Login from "./Page/login-page";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, resetAuthSlice } from "./Store/authSlice";
import { toastAlert } from "./Component/ToasteMessage";
import { resetConnectSlice } from "./Store/connectSlice";
import { logout } from "./Services/login-service";
// import EnterOtp from './Page/enter-otp';
// import { Client } from '@stomp/stompjs';
// import SockJS from "sockjs-client";
// import { useEffect, useState } from 'react';
// import ReceiveChallange from './Popup/receive-challange';

function App() {
  const User = useSelector(UserInfo);
  const dispatch = useDispatch();

  // const logoutProcess = () => {
  //   logout(User.username)
  //     .then((d) => {
  //       let res = d.data;
  //       if (res.Status === 200) {
  //         toastAlert(res.Message, "SUCCESS");
  //         dispatch(resetAuthSlice());
  //         dispatch(resetConnectSlice());
  //       }
  //     })
  //     .catch((ex) => {
  //       let res = ex.response;
  //       if (res && res.status === 403) {
  //         toastAlert("You are not authorized user!", "ERROR");
  //       } else if (res && res.status === 500) {
  //         toastAlert(res.data.message, "ERROR");
  //       }
  //     });
  // };
  // useEffect(() => {
  //   const handleUnload = (event) => {
  //     axios.get("http://192.168.100.43:8080/auth/test")
  //       .then(d => {

  //       });
  //     if (User.username !== "") {
  //       logoutProcess();
  //     }
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };
  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, []);
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
