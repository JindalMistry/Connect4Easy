import "react-toastify/dist/ReactToastify.css";
import './Css/toastify.css';
import './Css/login-page.css';
import './Css/global.css';
import './Css/enter-otp.css';
import './Css/home.css';
import Login from './Page/login-page';
// import EnterOtp from './Page/enter-otp';
// import { Client } from '@stomp/stompjs';
// import SockJS from "sockjs-client";
// import { useEffect, useState } from 'react';
// import ReceiveChallange from './Popup/receive-challange';

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
