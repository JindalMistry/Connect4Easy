import React, { useEffect, useRef, useState } from "react";
import { json, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Button from "../Component/Button";
import PlayConnection from "./play-connection";
import AddConnection from "../Popup/add-connection";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, setSocketResponse } from "../Store/authSlice";
import {
  acceptConnection,
  getNotifications,
  pullNotification,
} from "../Services/conn-service";
import {
  ConnectInfo,
  deleteNotification,
  setNotifications,
  updateActiveNotification,
} from "../Store/connectSlice";
import { logout } from "../Services/login-service";

const SOCKET_URL = "ws://localhost:8080/ws";
const SOCKJS_URL = "http://localhost:8080/ws";
// const SOCKET_URL = "ws://192.168.100.43:8080/ws";
// const SOCKJS_URL = "http://192.168.100.43:8080/ws";
let stompClient = null;

export default function Home(props) {
  const location = useLocation();
  const User = useSelector(UserInfo);
  const Connector = useSelector(ConnectInfo);
  const dispatch = useDispatch();
  const sidebarRef = useRef();

  const [showAddConnPopup, setShowAddConnPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("2");
  const [notiData, setNotiData] = useState([]);
  const [refConnList, setRefConnList] = useState(false);

  useEffect(() => {
    if (stompClient === null) {
      stompClient = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: { sessionId: location.state.username }
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
              if (e && e.body) {
                dispatch(setSocketResponse({ res: e.body }));
              }
            },
            {sessionId : location.state.username}
          );
          // stompClient.subscribe(
          //   "/topic/public",
          //   (e) => {

          //   },
          // );
          // stompClient.publish('/app/chat.subUser', {}, JSON.stringify({user_id : location.state.user_id, username : location.state.username}));
        }
      };
      stompClient.onDisconnect = () => {
        logoutProcess();
      };
      stompClient.activate();
    }
  }, []);
  useEffect(() => {
    if (User.socketResponse) {
      let res = JSON.parse(User.socketResponse);
      if (res.type === "MESSAGE") {
        loadNotifications();
      }
    }
  }, [User.socketResponse]);

  useEffect(() => {
    setNotiData(Connector.notifications);
  }, [Connector.notifications]);

  const loadNotifications = () => {
    getNotifications(User.username)
      .then((res) => {
        console.log("Notification loaded : ", res.data);
        if (res.status === 200) {
          dispatch(setNotifications(res.data));
          dispatch(
            updateActiveNotification(res.data.filter((o) => o.IsRead !== true))
          );
        }
      })
      .catch((ex) => {
        setNotiData([]);
      });
  };

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

  const onConnectionRequestPress = (item, type) => {
    let obj = {
      user_id: User.user_id,
      ref_id: item.ref_id,
      username: User.username,
      reference_name: item.refname,
    };
    acceptConnection(obj, type)
      .then((response) => {
        let res = response.data;
        if (res.Status === 200) {
          if (type === "ACCEPT") {
            alert(res.Message);
            setRefConnList(true);
          }
          let notiObj = {
            notification_id: item.notification_id,
            message: "",
            user_id: "",
            username: "",
            IsRead: false,
            type: "",
            ref_id: "",
            refname: "",
          };
          pullNotification(notiObj).then((d) => {
            let response = d.data;
            if (response.Status === 200) {
              dispatch(deleteNotification({ noti_id: item.notification_id }));
            }
          });
        }
      })
      .catch((ex) => { });
  };
  const logoutProcess = () => {
    logout(User.username).then(res => {

    }).catch(ex => {
      let res = ex.response;
      if (res.status === 403) {
        alert('You are not authorized user!');
      }
      else if (res.status === 500) {
        alert(res.data.message);
      }
    });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (sidebarRef) {
      if (sidebarRef.current) {
        window.addEventListener('mousedown', (e) => {
          if (!sidebarRef.current.contains(e.target)) {
            sidebarRef.current.className = "connection-req-sidebar close";
          }
        });
      }
    }
  }, [sidebarRef]);
  return (
    <>
      {showAddConnPopup ?
        <AddConnection onClose={() => setShowAddConnPopup(false)} show={showAddConnPopup} /> : null}
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
            {notiData.map((item, index) => {
              return item.type === "FRIEND_REQUEST" ? (
                <li key={index}>
                  <p>{item.message}</p>
                  <div>
                    <Button
                      label={"Accept"}
                      id={"Accept"}
                      className={"connection-req-btns green"}
                      onClick={(e) => onConnectionRequestPress(item, "ACCEPT")}
                    />
                    <Button
                      label={"Ignore"}
                      id={"Ignore"}
                      className={"connection-req-btns red"}
                      onClick={(e) => onConnectionRequestPress(item, "DECLINE")}
                    />
                  </div>
                </li>
              ) : item.type === "MESSAGE" ? (
                <li>{item.message}</li>
              ) : null;
            })}
          </ul>
        </div>
        <div className="connection-sidebar-seperator"></div>
        <div className="connection-req-footer">
          <Button
            label={"Log out"}
            className={"log-out-btn"}
            onClick={logoutProcess}
          />
        </div>
      </div>
      <div className="home-container">
        <div className="home-wrapper flex flex-col">
          <p className="home-header">
            Welcome <span>&nbsp;{User && User.username}</span>!
          </p>
          <div className="add-friend-button">
            <div
              className="friend-request-icon color-green"
              onClick={toggleSidebar}
            >
              <div>
                {Connector.notifications && Connector.notifications.length}
              </div>
              <ion-icon name="notifications-outline"></ion-icon>
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
            {activeTab === "2" ? (
              <div
                className="friend-request-icon plus-icon"
                onClick={() => {
                  setShowAddConnPopup(true);
                }}
              >
                <ion-icon name="add-circle-outline"></ion-icon>
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
          {activeTab == "2" ? (
            <PlayConnection
              referesh={refConnList}
              setRefreresh={() => setRefConnList(false)}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
