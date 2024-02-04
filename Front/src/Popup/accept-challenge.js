import React from 'react';
import Modal from '../Component/Modal';
import Button from '../Component/Button';
import '../Css/conn-detail.css';
import '../Css/receive-challange.css';

export default function AcceptChallenge({ onClose, show, sender, onAccept, onDecline }) {
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
            <div className='accept-challange-wrapper'>
                <div className='conn-detail-list'>
                <p 
                    style={{
                        width: "100%",
                        fontSize: "2em",
                        textAlign: "center",
                        color: "black",
                        fontWeight: "800",
                        padding: "0% 15%"
                    }}
                >{`Challenge has been accepted!`}</p>
                </div>
                <div className='receive-challange-btn-wrapper'>
                    <Button
                        label={"DECLINE"}
                        onClick={onDecline}
                        className={"receive-challange-play-btn decline"}
                    />
                    <Button
                        label={"PLAY"}
                        onClick={onAccept}
                        className={"receive-challange-play-btn accept"}
                    />
                </div>
            </div>
        </Modal>
    );
}

AcceptChallenge.defaultProps = {
    onClose: () => { },
    show: false,
    sender: {}
};