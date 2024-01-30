import React, { useEffect, useState } from 'react';
import TextBox from '../Component/TextBox';
import Button from '../Component/Button';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/login-service';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { UserInfo, activeStompClient, setUser } from '../Store/authSlice';
import axios from 'axios';

export default function Login() {

    const navigate = useNavigate();
    const User = useSelector(UserInfo);
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState("login");

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
        }
        else {
            setStatus("login");
        }
        setUsername("");
        setPassword("");
    };

    const onLoginPress = () => {
        if (status === "login") {
            let obj = {
                username: username,
                password: password
            };
            login(obj).then(d => {
                if (d.status === 200) {
                    console.log("D.data : ", d.data);
                    dispatch(setUser({ user_id: d.data.user_id, username: username, token: d.data.token }));
                    navigate(
                        "/home",
                        { state: { username: username } }
                    );
                    axios.interceptors.request.use(function (config) {
                        const token = d.data.token;
                        config.baseURL = 'http://localhost:8080/';
                        // config.baseURL = 'http://192.168.100.43:8080/';
                        config.headers.Authorization = `Bearer ${token}`;
                        return config;
                    });
                }
            });
        }
    };
    return (
        <div className='login-wrapper flex align-c justify-c'>
            <div className='login-container'>
                <p className='login-header'><b>{status == "login" ? "Sign in" : "Sign Up"}</b></p>
                <div className='textbox-container'>
                    <TextBox
                        label={"Username"}
                        className={"login-text"}
                        value={username}
                        onChange={onUsernameChange}
                        id={"username"}
                    ></TextBox>
                </div>
                <div className='textbox-container'>
                    <TextBox
                        label={"Password"}
                        className={"login-text"}
                        value={password}
                        onChange={onPasswordChange}
                        type={"password"}
                        id={"password"}
                    ></TextBox>
                </div>
                <div className='btn-wrapper'>
                    <Button
                        label={status == "login" ? "Sign in" : "Sign Up"}
                        className={"login-btn"}
                        onClick={onLoginPress}
                    />
                </div>
                {
                    status == "login"
                        ?
                        <p className='login-footer'>Are you a new user? <b onClick={changeStatus}><u>Sign Up!</u></b></p>
                        :
                        <p className='login-footer'>Already have an account? <b onClick={changeStatus}><u>Sign in!</u></b></p>
                }
            </div>
        </div>
    );
}
