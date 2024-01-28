import React from 'react';
import '../Css/component.css';

export default function Button({ label, onClick, className }) {
    return (
        <button
            className={"custom-btn " + className}
            type='button'
            onClick={onClick}
        >
            {label}
        </button>
    );
}
Button.defaultProps = {
    className: "",
    label: "",
    onClick: () => { console.log("button clicked!"); }
};
