import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "ws://localhost:8080/ws";
const SOCKJS_URL = "http://localhost:8080/ws";
let stompClient = null;

export default function Home(props) {
  const location = useLocation();
  useEffect(() => {
    stompClient = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    stompClient.webSocketFactory = function () {
      return new SockJS(SOCKJS_URL);
    };
    stompClient.onConnect = function () {
      if (stompClient) {
        console.log("Client connected to web socket : ", "/user/" +location.state.user.username + "/queue/friends");
        stompClient.subscribe(
          "/user/" +location.state.user.username + "/queue/friends",
          (e) => {
            console.log("Message from web socket : ", e.body);
          }
        );
      }
    };
    stompClient.onDisconnect = () => {
      console.log("Disconneced.!");
    };

    stompClient.activate();
  }, []);
  return <div>Home</div>;
}
