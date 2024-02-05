import React, { useEffect, useState } from 'react';
import Modal from '../Component/Modal';
import Button from '../Component/Button';
import '../Css/conn-detail.css';
import { sendChallenge } from '../Services/conn-service';
import { useSelector } from 'react-redux';
import { UserInfo } from '../Store/authSlice';
import { ConnectInfo } from '../Store/connectSlice';
import { toastAlert } from '../Component/ToasteMessage';

export default function ConnDetail({ onClose, show, conn }) {
    const User = useSelector(UserInfo);
    const Connector = useSelector(ConnectInfo);
    const [btnLoader, setBtnLoader] = useState(false);
    const onPlayButtonPress = () => {
        let obj = {
            user_id: User.user_id,
            username: User.username,
            ref_id: conn.ref_id,
            reference_name: conn.refname,
        };
        setBtnLoader(true);
        sendChallenge(obj).then((res) => {
            let response = res.data;
            if (response.Status === 200) {
                toastAlert(response.Message, "SUCCESS");
                if (onClose) {
                    onClose();
                }
            }
            setBtnLoader(false);
        })
        .catch((err) => {
            console.log("Err");
            toastAlert("Error while sending challenge", "ERROR");
        })
    };

    return (
        <Modal
            type={"small-square"}
            show={show}
            label={""}
            closeOutsideClick={true}
            OnClose={() => {
                if (onClose) {
                    onClose();
                }
            }}
        >
            <div className='conn-detail-wrapper'>
                <div className='conn-detail-left'>
                    <div style={{ backgroundImage: conn.gradient, color: conn.color }}>
                        {conn.refname[0]?.toUpperCase()}
                    </div>
                    <p>{conn.wins} - {conn.total_games - conn.wins}</p>
                </div>
                <div className='conn-detail-right'>
                    <div className='conn-detail-list'>
                        <p className='conn-detail-header'>{conn.refname}</p>
                        <ul>
                            <li><p>Winnings</p> <b>150M</b></li>
                            <li><p>Matches played</p> <b>251</b></li>
                            <li><p>Recent win (%)</p> <b>60</b></li>
                            <li><p>Status</p> <b style={{ color: "green" }}>ONLINE</b></li>
                        </ul>
                    </div>
                    <div className='conn-detail-btn-wrapper'>
                        <Button
                            label={"Play"}
                            onClick={onPlayButtonPress}
                            className={"conn-detail-play-btn"}
                            showLoader={btnLoader}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

ConnDetail.defaultProps = {
    onClose: () => { },
    show: false,
    conn: {}
};