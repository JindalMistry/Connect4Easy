import React, { useEffect, useRef } from 'react';

export default function Modal({ type, children, label, OnClose, className, show, closeOutsideClick }) {
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

    useEffect(() => {
        if (modalRef) {
            if (modalRef.current && closeOutsideClick === true) {
                window.addEventListener('mousedown', (e) => {
                    if (modalRef.current) {
                        if(!modalRef.current.contains(e.target)){
                            OnClose();
                        }
                    }
                });
            }
        }
    }, [modalRef]);

    return (
        <div className={`popup ${show == true ? "modalwrapopen" : "modalwrapclose"}`}>
            <div className={type + " relative " + className} ref={modalRef}>
                {
                    label !== "" ?
                        <div className='popup-cross'>
                            <p>{label}</p>
                            <span onClick={onClose}><ion-icon name="close-outline"></ion-icon></span>
                        </div>
                        :
                        null
                }
                {children}
            </div>
        </div>
    );
}

Modal.defaultProps = {
    type: "large",
    OnClose: () => { console.log("OnClose is undefined."); },
    className: "",
    show: false,
    closeOutsideClick: false,
    label: ""
};