import React from 'react';
import '../Css/component.css';

export default function TextBox({ label, placeholder, disabled, onChange, value, className, type, hideLabel, id }) {
    return (
        <div className='custom-textbox-wrapper flex flex-col'>
            {!hideLabel ? <p>{label}</p> : null}
            <input
                placeholder={placeholder}
                className={'custom-textbox ' + className}
                type={type}
                value={value}
                onChange={onChange}
                id={id}
            />
        </div>
    );
}
TextBox.defaultProps = {
    label: "Text box",
    placeholder: "",
    disabled: false,
    onChange: (e) => { console.log(e); },
    value: "",
    className: "",
    type: "text",
    hideLabel : false,
    id : ""
};
