import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserInfo } from '../Store/authSlice';
import { getConnections } from '../Services/conn-service';

export default function PlayConnection({ referesh }) {
    const User = useSelector(UserInfo);
    const dispatch = useDispatch();
    const [connections, setConnections] = useState([]);

    const loadConnections = () => {
        getConnections(User.username).then(res => {
            if (res.status === 200) {
                console.log("Friends found : ", res.data);
                setConnections(res.data);
            }
        });
    };

    useEffect(() => {
        loadConnections();
    }, []);
    return (
        <div className="home-main">
            {connections.map((item, index) => {
                return (
                    <div key={index} className="friend-tile">
                        <div className="friend-logo">{item.refname.charAt(0).toUpperCase()}</div>
                        <b><div className={`friend-status ${item.active ? "green" : "red"}`}></div> {item.refname}</b>
                        <b>{item.wins} - {item.total_games - item.wins}</b>
                    </div>
                );
            })}
        </div>
    );
}
