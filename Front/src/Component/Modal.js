import React, { useEffect, useRef } from 'react';

export default function Modal({ type, children, label, OnClose, className, show }) {
    const modalRef = useRef();
    function onClose() {
        OnClose();
    }
    useEffect(() => {
        if (modalRef && modalRef.current) {
            console.log(type, className);
            modalRef.current.className = `${type} relative ${className} ${(show == true) ? " modalopen" : " modalclose"}`;
        }
    }, [show]);
    return (
        <div className={`popup ${show == true ? "modalopen" : "modalclose"}`}>
            <div className={type + " relative " + className} ref={modalRef}>
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
    OnClose: () => { console.log("OnClose is undefined."); },
    className: "",
    show: false
};