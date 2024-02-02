import React from 'react';
import Modal from '../Component/Modal';
import Button from '../Component/Button';
import '../Css/conn-detail.css';
import '../Css/receive-challange.css';

export default function ReceiveChallange({ onClose, show, sender, onAccept, onDecline }) {
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
            <div className='receive-challange-wrapper'>
                <div className='conn-detail-list'>
                    <p className='conn-detail-header'>{"You have been challanged"}</p>
                    <p className='accept-challange-para'>{`You have received a challange from ${sender.username}!`}</p>
                    <ul>
                        <li><p>Winnings</p> <b>150M</b></li>
                        <li><p>Matches played</p> <b>251</b></li>
                        <li><p>Recent win (%)</p> <b>60</b></li>
                    </ul>
                </div>
                <div className='receive-challange-btn-wrapper'>
                    <Button
                        label={"Decline"}
                        onClick={onDecline}
                        className={"receive-challange-play-btn decline"}
                    />
                    <Button
                        label={"Accept"}
                        onClick={onAccept}
                        className={"receive-challange-play-btn accept"}
                    />
                </div>
            </div>
        </Modal>
    );
}

ReceiveChallange.defaultProps = {
    onClose: () => { },
    show: false,
    sender: {}
};