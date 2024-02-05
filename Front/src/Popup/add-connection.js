import React, { useEffect, useState } from 'react';
import Modal from '../Component/Modal';
import TextBox from '../Component/TextBox';
import Button from '../Component/Button';
import '../Css/add-connection.css';
import { addConnection, pushNotification, searchConnection } from '../Services/conn-service';
import { useDispatch, useSelector } from 'react-redux';
import { UserInfo } from '../Store/authSlice';
import { insertNotification } from '../Store/connectSlice';
import { toastAlert } from '../Component/ToasteMessage';

export default function AddConnection({ onClose, show, onRefresh }) {

    const User = useSelector(UserInfo);
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");
    const defaultBtnLoader = {
        showSearchBtn: false,
        showAddFriendBtn: false
    };
    const [btnLoader, setBtnLoader] = useState(defaultBtnLoader);

    const loadUsers = () => {
        setBtnLoader(prev => ({ ...prev, showSearchBtn: true }));
        searchConnection(text, User.user_id).then(res => {
            if (res.status === 200) {
                console.log("User search : ", res.data);
                setUsers(res.data);
            }
            setBtnLoader(prev => ({ ...prev, showSearchBtn: false }));
        });
    };

    const onSearchChange = (e) => {
        console.log("Search change in add connection : ", e.target.value);
        setText(e.target.value);
        e.preventDefault();
    };
    const onAddConnection = (id) => {
        let refUser = users.find(o => o.user_id === id);
        if (refUser) {
            setBtnLoader(prev => ({ ...prev, showAddFriendBtn: true }));
            const obj = {
                user_id: User.user_id,
                username: User.username,
                ref_id: refUser.user_id,
                reference_name: refUser.username,
            };
            addConnection(obj).then(res => {
                let response = res.data;
                console.log("Res.data", response);
                if (response.Status === 200) {
                    toastAlert(response.Message, "SUCCESS")
                    if (response.Data.type === "MESSAGE") {
                        onRefresh();
                    }
                }
                else{
                    toastAlert(response.Message, "ERROR");
                }
                setBtnLoader(prev => ({ ...prev, showAddFriendBtn: false }));
            }).catch(ex => {
                console.log("Res 50: ", ex);
                setBtnLoader(prev => ({ ...prev, showAddFriendBtn: false }));
            });
        }
        else { console.log("User not found!"); }
    };

    return (
        <Modal
            type={"mid"}
            label={"Add Friend"}
            OnClose={() => {
                if (onClose) {
                    onClose();
                }
            }}
            show={show}
            className={"add-conn-modal"}
        >
            <div className='add-conn-wrapper'>
                <div className='header-add-conn'>
                    <div className='conn-search-input'>
                        <TextBox
                            hideLabel={true}
                            className={"conn-search-text"}
                            placeholder={"Enter username"}
                            value={text}
                            onChange={onSearchChange}
                            id={"username"}
                        ></TextBox>
                    </div>
                    <div className='conn-button-wrapper'>
                        <Button
                            label={"Search"}
                            className={"conn-search-btn"}
                            onClick={loadUsers}
                            showLoader={btnLoader.showSearchBtn}
                        />
                    </div>
                </div>
                <div className='conn-list'>
                    <ul>
                        {users.map((item, index) => {
                            return (
                                <li key={index}>
                                    <div>
                                        <span>{index + 1}.&nbsp; {item.username}</span>
                                    </div>
                                    <div>
                                        <Button
                                            label={"Add friend"}
                                            className={"conn-list-btn"}
                                            id={item.user_id}
                                            onClick={() => onAddConnection(item.user_id)}
                                            showLoader={btnLoader.showAddFriendBtn}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </Modal>
    );
}
