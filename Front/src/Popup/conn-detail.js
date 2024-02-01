import React from 'react';
import Modal from '../Component/Modal';
import Button from '../Component/Button';
import '../Css/conn-detail.css';

export default function ConnDetail({ onClose, show, conn }) {
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
                            onClick={() => { }}
                            className={"conn-detail-play-btn"}
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