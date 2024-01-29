import React, { useEffect, useRef, useState } from "react";
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
  const sidebarRef = useRef();

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
          console.log(
            "Client connected to web socket : ",
            "/user/" + location.state.username + "/queue/friends"
          );
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

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      let ref = sidebarRef.current;
      if (ref.className.includes("close")) {
        ref.className = "connection-req-sidebar open";
      } else {
        ref.className = "connection-req-sidebar close";
      }
    }
  };

  return (
    <>
      {showAddConnPopup ? (
        <AddConnection onClose={() => setShowAddConnPopup(false)} />
      ) : null}
      <div className="connection-req-sidebar close" ref={sidebarRef}>
        <div className="connection-req-header">
          <p>Notification</p>
          <span onClick={toggleSidebar}>
            <ion-icon name="close-outline"></ion-icon>
          </span>
        </div>
        <div className="connection-sidebar-seperator"></div>
        <div className="connection-req-body">
          <ul>
            <li>
              You have a message from ritesh that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Harsh</li>
            <li>
              You have a message from Yash that you play very bad. hahahahah
            </li>
            <li>
              <p>You have a friend request from Someone</p>
              <div>
                <Button
                  label={"Accept"}
                  className={"connection-req-btns green"}
                />
                <Button
                  label={"Decline"}
                  className={"connection-req-btns red"}
                />
              </div>
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from ritesh that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Harsh</li>
            <li>
              You have a message from Yash that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Someone</li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from ritesh that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Harsh</li>
            <li>
              You have a message from Yash that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Someone</li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from ritesh that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Harsh</li>
            <li>
              You have a message from Yash that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Someone</li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from ritesh that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Harsh</li>
            <li>
              You have a message from Yash that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Someone</li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from ritesh that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Harsh</li>
            <li>
              You have a message from Yash that you play very bad. hahahahah
            </li>
            <li>You have a friend request from Someone</li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
            <li>
              You have a message from Meet that you play very bad. hahahahah
            </li>
          </ul>
        </div>
        <div className="connection-sidebar-seperator"></div>
        <div className="connection-req-footer">
          <Button
            label={"Log out"}
            className={"log-out-btn"}
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="home-wrapper flex flex-col">
        <p className="home-header">Welcome {User && User.username}!</p>
        <div className="add-friend-button">
          <div
            className="friend-request-icon color-green"
            onClick={toggleSidebar}
          >
            <ion-icon name="chatbubbles"></ion-icon>
          </div>
          {activeTab === "2" ? (
            <div>
              <Button
                label={"Add Friend"}
                className={"add-friend"}
                onClick={() => {
                  setShowAddConnPopup(true);
                }}
              />
            </div>
          ) : null}
        </div>
        <div className="home-body">
          <div className="main-btn-container">
            <Button
              label={"Play online"}
              className={"home-body-btn"}
              onClick={() => {
                setActiveTab("1");
              }}
            />
          </div>
          <div className="main-btn-container">
            <Button
              label={"Play with friends"}
              className={"home-body-btn"}
              onClick={() => {
                setActiveTab("2");
              }}
            />
          </div>
        </div>
        {activeTab == "2" ? <PlayConnection referesh={false} /> : null}
      </div>
    </>
  );
}
