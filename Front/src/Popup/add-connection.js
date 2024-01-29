import React, { useState } from 'react';
import Modal from '../Component/Modal';
import TextBox from '../Component/TextBox';
import Button from '../Component/Button';
import '../Css/add-connection.css';
import { searchConnection } from '../Services/conn-service';

export default function AddConnection({ onClose }) {

    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");

    const loadUsers = () => {
        searchConnection(text).then(res => {
            if (res.status === 200) {
                console.log("User search : ", res.data);
                setUsers(res.data);
            }
        });
    };

    const onSearchChange = (e) => {
        console.log("Search change in add connection : ", e.target.value);
        setText(e.target.value);
        e.preventDefault();
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
                    <div>
                        <Button
                            label={"Search"}
                            className={"conn-search-btn"}
                            onClick={loadUsers}
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
