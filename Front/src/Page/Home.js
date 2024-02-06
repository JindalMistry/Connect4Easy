import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Button from "../Component/Button";
import PlayConnection from "./play-connection";
import AddConnection from "../Popup/add-connection";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, resetAuthSlice, setSocketResponse } from "../Store/authSlice";
import {
  acceptChallenge,
  acceptConnection,
  declineChallenge,
  getNotifications,
  pullNotification,
  startGame,
} from "../Services/conn-service";
import {
  ConnectInfo,
  deleteNotification,
  resetConnectSlice,
  setNotifications,
  updateActiveNotification,
} from "../Store/connectSlice";
import { logout } from "../Services/login-service";
import LoadingScreen from "../Component/LoadingScreen";
import ReceiveChallange from "../Popup/receive-challange";
import ConnectionScreen from "../Popup/connecting-modal";
import AcceptChallenge from "../Popup/accept-challenge";
import { toastAlert } from "../Component/ToasteMessage";

// const SOCKET_URL = "ws://localhost:8080/ws";
// const SOCKJS_URL = "http://localhost:8080/ws";
const SOCKET_URL = "ws://192.168.100.43:8080/ws";
const SOCKJS_URL = "http://192.168.100.43:8080/ws";
// const SOCKET_URL = "ws://192.168.1.7:8080/ws";
// const SOCKJS_URL = "http://192.168.1.7:8080/ws";
let stompClient = null;

export default function Home(props) {
  const location = useLocation();
  const User = useSelector(UserInfo);
  const Connector = useSelector(ConnectInfo);
  const dispatch = useDispatch();
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const defaultBtnLoader = {
    showLaterLoader: false,
    showPlayLoader: false,
    showAcceptLoader: false,
    showDeclineLoader: false
  };
  const [btnLoader, setBtnLoader] = useState(defaultBtnLoader);
  const [showAddConnPopup, setShowAddConnPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("2");
  const [notiData, setNotiData] = useState([]);
  const [refConnList, setRefConnList] = useState(false);
  const [showChallangeReceivedModalPopup, setShowChallangeReceivedModalPopup] =
    useState(false);
  const [showConnectionModalPopup, setShowConnectionModalPopup] =
    useState(false);
  const [acceptChallengeModalPopup, setAcceptChallengeModalPopup] =
    useState(false);
  const [challenger, setChallenger] = useState({});
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    if (stompClient === null) {
      console.warn("Connection established again!");
      stompClient = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: { sessionId: location.state.username },
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
            { sessionId: location.state.username }
          );
          // stompClient.publish('/app/testsocket', {}, JSON.stringify({ user_id: location.state.user_id, username: location.state.username }));
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
      console.log("Socket response received :", res);
      if (res.type === "MESSAGE") {
        loadNotifications();
      }
      if (res.type === "CHALLENGE_SEND") {
        loadNotifications();
        setChallenger({
          user_id: res.user_id,
          username: res.username,
          notification_id: parseInt(res.content),
        });
        setShowChallangeReceivedModalPopup(true);
      }
      if (res.type === "CHALLENGE_DECLINE") {
        loadNotifications();
      }
      if (res.type === "CHALLENGE_REQUEST") {
        loadNotifications();
        setChallenger({
          user_id: res.user_id,
          username: res.username,
        });
      }
      if (res.type === "CHALLENGE_ACCEPT") {
        setChallenger({
          user_id: res.user_id,
          username: res.username,
        });
        setGameId(parseInt(res.content));
        setAcceptChallengeModalPopup(true);
        loadNotifications();
      }
      if (res.type === "START_GAME") {
        loadNotifications();
        navigate("/game", {
          state: {
            game_id: gameId,
            ref_id: challenger.user_id,
            ref_name: challenger.username,
            player: 2,
          },
        });
      }
      if (res.type === "DO_NOT_START") {
        toastAlert('Your opponent has declined the game request!', "ERROR");
        setShowConnectionModalPopup(false);
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
            toastAlert(res.Message, "SUCCESS");
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
    logout(User.username)
      .then((d) => {
        let res = d.data;
        if (res.Status === 200) {
          toastAlert(res.Message, "SUCCESS");
          dispatch(resetAuthSlice());
          dispatch(resetConnectSlice());
          setTimeout(() => {
            navigate("/");
          }, 50);
        }
      })
      .catch((ex) => {
        let res = ex.response;
        if (res && res.status === 403) {
          toastAlert("You are not authorized user!", "ERROR");
        } else if (res && res.status === 500) {
          toastAlert(res.data.message, "ERROR");
        }
      });
  };
  const onChallengeAccept = () => {
    let obj = {
      notification_id: challenger.notification_id,
      user_id: User.user_id,
      username: User.username,
      ref_id: challenger.user_id,
      refname: challenger.username,
    };
    setBtnLoader(prev => ({ ...prev, showAcceptLoader: true }));
    console.log("Input object at accept challenge : ", obj);
    acceptChallenge(obj)
      .then((d) => {
        let res = d.data;
        if (res.Status === 200) {
          setShowChallangeReceivedModalPopup(false);
          if (res.Data) {
            setGameId(res.Data.game_id);
            setShowConnectionModalPopup(true);
          }
          setBtnLoader(prev => ({ ...prev, showAcceptLoader: false }));
        }
      })
      .catch((ex) => {
        console.log("Exception found 200 : ", ex);
        setBtnLoader(prev => ({ ...prev, showAcceptLoader: false }));
      });
  };
  const onChallengeDecline = () => {
    let noti = challenger.notification_id;
    let obj = {
      notification_id: noti,
      message: "",
      user_id: User.user_id,
      username: User.username,
      IsRead: false,
      type: "",
      ref_id: challenger.user_id,
      refname: challenger.username,
    };
    console.log("Input object", obj);
    setBtnLoader(prev => ({ ...prev, showDeclineLoader: true }));
    declineChallenge(obj).then((d) => {
      let res = d.data;
      if (res.Status === 200) {
        loadNotifications();
        setShowChallangeReceivedModalPopup(false);
        setBtnLoader(prev => ({ ...prev, showDeclineLoader: false }));
      }
    })
      .catch(ex => {
        console.log("287 : ", ex);
        setBtnLoader(prev => ({ ...prev, showDeclineLoader: false }));
      });
  };

  const onStartGame = () => {
    // setBtnLoader(prev => ({ ...prev, showPlayLoader: true }));
    startGame(User.username, challenger.username, "accept")
      .then((d) => {
        let res = d.data;
        if (res.Status === 200) {
          setAcceptChallengeModalPopup(false);
          navigate("/game", {
            state: {
              game_id: gameId,
              ref_id: challenger.user_id,
              ref_name: challenger.username,
              player: 1,
            },
          });
          loadNotifications();
          setBtnLoader(prev => ({ ...prev, showPlayLoader: false }));
        }
      })
      .catch((err) => {
        setBtnLoader(prev => ({ ...prev, showPlayLoader: false }));
        console.log("Error: " + err);
      });
  };
  const onCancelGameStart = () => {
    setBtnLoader(prev => ({ ...prev, showLaterLoader: true }));
    startGame(User.username, challenger.username, "decline")
      .then((d) => {
        let res = d.data;
        console.log("Decline challenge", res);
        if (res.Status === 200) {
          setAcceptChallengeModalPopup(false);
          loadNotifications();
        } else {
          toastAlert(res.Message, "ERROR");
        }
        setBtnLoader(prev => ({ ...prev, showLaterLoader: false }));
      })
      .catch((err) => {
        console.log("Error: " + err);
        setAcceptChallengeModalPopup(false);
        setBtnLoader(prev => ({ ...prev, showLaterLoader: false }));
      });
  };
  const handleChallengeNotificationPress = (item) => {
    console.log(item);
    let timeDiff =
      new Date().getMilliseconds() - new Date(item.timestamp).getMilliseconds();
    console.log(timeDiff);
    if (timeDiff / (1000 * 60) <= 5) {
      setChallenger({
        user_id: item.ref_id,
        username: item.refname,
        notification_id: item.notification_id,
      });
      if (item.type === "CHALLENGE_ACCEPT") {
        setAcceptChallengeModalPopup(true);
      } else if (item.type === "CHALLENGE_REQUEST") {
        setShowChallangeReceivedModalPopup(true);
      }
      toggleSidebar();
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (sidebarRef) {
      if (sidebarRef.current) {
        window.addEventListener("mousedown", (e) => {
          if (sidebarRef?.current) {
            if (!sidebarRef.current.contains(e.target))
              sidebarRef.current.className = "connection-req-sidebar close";
          }
        });
      }
    }
  }, [sidebarRef]);
  return (
    <>
      {acceptChallengeModalPopup ? (
        <AcceptChallenge
          show={acceptChallengeModalPopup}
          onClose={() => {
            setAcceptChallengeModalPopup(false);
          }}
          sender={challenger}
          onPlay={onStartGame}
          onLater={onCancelGameStart}
          showLaterLoader={btnLoader.showLaterLoader}
          showPlayLoader={btnLoader.showPlayLoader}
        />
      ) : null}
      {showConnectionModalPopup ? (
        <ConnectionScreen show={showConnectionModalPopup} conn={challenger} />
      ) : null}
      {showChallangeReceivedModalPopup ? (
        <ReceiveChallange
          show={showChallangeReceivedModalPopup}
          onClose={() => {
            setShowChallangeReceivedModalPopup(false);
          }}
          sender={challenger}
          onAccept={onChallengeAccept}
          onDecline={onChallengeDecline}
          showAcceptLoader={btnLoader.showAcceptLoader}
          showDeclineLoader={btnLoader.showDeclineLoader}
        />
      ) : null}
      {showAddConnPopup ? (
        <AddConnection
          onClose={() => setShowAddConnPopup(false)}
          onRefresh={loadNotifications}
          show={showAddConnPopup}
        />
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
              ) : item.type === "CHALLENGE_REQUEST" ? (
                <li
                  onClick={() => {
                    handleChallengeNotificationPress(item);
                  }}
                >
                  {item.message}
                </li>
              ) : item.type === "CHALLENGE_ACCEPT" ? (
                <li
                  onClick={() => {
                    handleChallengeNotificationPress(item);
                  }}
                >
                  {item.message}
                </li>
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
          {activeTab === "2" ? (
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
