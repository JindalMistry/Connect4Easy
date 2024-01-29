import React from 'react';

export default function Modal({ type, children, label, OnClose }) {
    function onClose() {
        OnClose();
    }
    return (
        <div className='popup'>
            <div className={type + " relative"}>
                <div className='popup-cross'>
                    <p>{label}</p>
                    <span onClick={onClose}><ion-icon name="close-outline"></ion-icon></span>
                </div>
                {children}
            </div>
        </div>
    );
}

Modal.defaultProps = {
    type: "large",
    OnClose: () => { console.log("OnClose is undefined."); }
};