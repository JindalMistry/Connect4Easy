import React from 'react';
import '../Css/component.css';

export default function Button({ label, onClick, className, id, showLoader }) {
    return (
        <button
            className={"custom-btn " + className + (showLoader ? " button-loader" : "")}
            type='button'
            onClick={onClick}
        >
            {!showLoader ? label : <span style={{color:"transparent"}}>""</span>}
        </button>
    );
}
Button.defaultProps = {
    className: "",
    label: "",
    onClick: () => { console.log("button clicked!"); },
    id: "",
    showLoader : false
};
