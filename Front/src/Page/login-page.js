import React, { useEffect, useState } from "react";
import TextBox from "../Component/TextBox";
import Button from "../Component/Button";
import { useNavigate } from "react-router-dom";
import { login, register } from "../Services/login-service";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, activeStompClient, setUser } from "../Store/authSlice";
import axios from "axios";
import LoadingScreen from "../Component/LoadingScreen";
import { toastAlert } from "../Component/ToasteMessage";

export default function Login() {
  const navigate = useNavigate();
  const User = useSelector(UserInfo);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("login");
  const [IsLoading, setIsLoading] = useState(false);

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
    e.preventDefault();
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    e.preventDefault();
  };
  const changeStatus = () => {
    if (status === "login") {
      setStatus("register");
    } else {
      setStatus("login");
    }
    setUsername("");
    setPassword("");
  };

  const onLoginPress = () => {
    setIsLoading(true);
    if (status === "login") {
      let obj = {
        username: username,
        password: password,
      };
      login(obj)
        .then((d) => {
          let response = d.data;
          if (response) {
            console.log("at login : ", response);
            toastAlert(response.Message, "SUCCESS");
            if (response.Status === 200) {
              console.log("D.data : ", response.Data);
              dispatch(
                setUser({
                  user_id: response.Data.user_id,
                  username: username,
                  token: response.Data.token,
                })
              );
              navigate("/home", {
                state: { username: username, user_id: response.Data.user_id },
              });
              axios.interceptors.request.use(function (config) {
                const token = response.Data.token;
                // config.baseURL = 'http://localhost:8080/';
                // config.baseURL = 'http://192.168.100.43:8080/';
                config.baseURL = "http://192.168.1.7:8080/";
                config.headers.Authorization = `Bearer ${token}`;
                return config;
              });
            }
          }
          setIsLoading(false);
        })
        .catch((ex) => {
          let res = ex.response;
          if (res && res.status === 403) {
            toastAlert("Please verify username or password.", "ERROR");
          } else if (res && res.status === 500) {
            toastAlert(res.data.message, "ERROR");
          }
          setIsLoading(false);
        });
    }
    if (status === "register") {
      let obj = {
        username: username,
        password: password,
      };
      register(obj)
        .then((d) => {
          let res = d.data;
          if (res.Status === 200) {
            toastAlert(
              "One time password has been sent to registered email and is only valid for 5 minutes."
              ,"SUCCESS"
            );
            navigate("/otp");
          }
          setIsLoading(false);
        })
        .catch((ex) => {
          console.log("Exception found 86: ", ex);
          setIsLoading(false);
        });
    }
  };
  return (
    <>
      <div className="login-wrapper flex align-c justify-c">
        <div className="login-container">
          <p className="login-header">
            <b>{status == "login" ? "Sign in" : "Sign Up"}</b>
          </p>
          <div className="textbox-container">
            <TextBox
              label={"Username"}
              className={"login-text"}
              value={username}
              onChange={onUsernameChange}
              id={"username"}
            ></TextBox>
          </div>
          <div className="textbox-container">
            <TextBox
              label={"Password"}
              className={"login-text"}
              value={password}
              onChange={onPasswordChange}
              type={"password"}
              id={"password"}
            ></TextBox>
          </div>
          <div className="btn-wrapper">
            <Button
              label={status == "login" ? "Sign in" : "Sign Up"}
              className={"login-btn"}
              onClick={() => {
                onLoginPress();
              }}
              showLoader={IsLoading}
            />
          </div>
          {status == "login" ? (
            <p className="login-footer">
              Are you a new user? <b onClick={changeStatus}>Sign Up!</b>
            </p>
          ) : (
            <p className="login-footer">
              Already have an account? <b onClick={changeStatus}>Sign in!</b>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
