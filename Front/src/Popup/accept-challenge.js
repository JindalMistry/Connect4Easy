import React from 'react';
import Modal from '../Component/Modal';
import Button from '../Component/Button';
import '../Css/conn-detail.css';
import '../Css/receive-challange.css';

export default function AcceptChallenge({
    onClose, show, sender, onPlay, onLater, showLaterLoader, showPlayLoader
}) {
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
                        label={"LATER"}
                        onClick={onLater}
                        className={"receive-challange-play-btn decline"}
                        showLoader={showLaterLoader}
                    />
                    <Button
                        label={"PLAY"}
                        onClick={onPlay}
                        className={"receive-challange-play-btn accept"}
                        showLoader={showPlayLoader}
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