import './Css/login-page.css';
import './Css/global.css';
import './Css/enter-otp.css';
import './Css/home.css';
import Login from './Page/login-page';
import EnterOtp from './Page/enter-otp';
// import { Client } from '@stomp/stompjs';
// import SockJS from "sockjs-client";
import { useEffect, useState } from 'react';

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
