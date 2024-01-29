import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Button from "../Component/Button";
import PlayConnection from "./play-connection";
import AddConnection from "../Popup/add-connection";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, setSocketResponse } from "../Store/authSlice";

const SOCKET_URL = "ws://localhost:8080/ws";
const SOCKJS_URL = "http://localhost:8080/ws";
let stompClient = null;

export default function Home(props) {
  const location = useLocation();
  const User = useSelector(UserInfo);
  const dispatch = useDispatch();

  const [showAddConnPopup, setShowAddConnPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("2");

  useEffect(() => {
    if (stompClient === null) {
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
          console.log("Client connected to web socket : ", "/user/" + location.state.username + "/queue/friends");
          stompClient.subscribe(
            "/user/" + location.state.username + "/queue/friends",
            (e) => {
              dispatch(setSocketResponse({ res: e.body }));
            }
          );
        }
      };
      stompClient.onDisconnect = () => {
        console.log("Disconneced.!");
      };
      stompClient.activate();
    }
  }, []);

  useEffect(() => {
    if (User.socketResponse) {
      console.log("Socket response recieved. : ", User.socketResponse);
    }
  }, [User.socketResponse]);

  return (
    <>
      {showAddConnPopup ? <AddConnection onClose={() => setShowAddConnPopup(false)} /> : null}
      <div className="home-wrapper flex flex-col">
        <p className="home-header">Welcome {User && User.username}!</p>
        <div className="add-friend-button">
          {
            activeTab === "2" ?
              <div>
                <Button
                  label={"Add Friend"}
                  className={"add-friend"}
                  onClick={() => { setShowAddConnPopup(true); }}
                />
              </div>
              :
              null
          }
        </div>
        <div className="home-body">
          <div className="main-btn-container">
            <Button
              label={"Play online"}
              className={"home-body-btn"}
              onClick={() => { setActiveTab('1'); }}
            />
          </div>
          <div className="main-btn-container">
            <Button
              label={"Play with friends"}
              className={"home-body-btn"}
              onClick={() => { setActiveTab('2'); }}
            />
          </div>
        </div>
        {
          activeTab == "2" ?
            <PlayConnection
              referesh={false}
            />
            :
            null
        }
      </div>
    </>
  );
}
