import React, { useRef } from 'react';

export default function LoadingScreen() {
    const leftRef = useRef();
    const rightRef = useRef();

    const process = () => {
        if (leftRef) {
            if (leftRef.current) {
                leftRef.current.className = "loading-screen-section left-close";
            }
        }
        if (rightRef) {
            if (rightRef.current) {
                rightRef.current.className = "loading-screen-section right-close";
            }
        }
    };
    return (
        <div className='loading-screen-wrapper'>
            <div className='loading-screen-section left-open' ref={leftRef}>
                <div className='loading-screen-icon' onClick={() => process()}>J</div>
                <p className='loading-screen-name'>Jindal_1305</p>
            </div>
            <div className='loading-screen-section right-open' ref={rightRef}>
                <div className='loading-screen-icon'>I</div>
                <p className='loading-screen-name'>Indrajit_1504</p>
            </div>
        </div>
    );
}
