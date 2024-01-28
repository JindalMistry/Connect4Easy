import React, { useEffect, useState } from 'react';
import TextBox from '../Component/TextBox';
import Button from '../Component/Button';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/login-service';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function Login() {

    const navigate = useNavigate();

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
        if(status === "login"){
            setStatus("register");
        }
        else{
            setStatus("login");
        }
        setUsername("");
        setPassword("");
    }

    const onLoginPress = () => {
        if(status === "login"){
            let obj = {
                username : username,
                password : password
            }
            login(obj).then(d => {
                if(d.status === 200){
                    console.log("D.data : ", d.data);
                    navigate(
                        "/home",
                        { state : {user : obj, token : d.data}}
                    )
                }
            })
        }
    }
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
