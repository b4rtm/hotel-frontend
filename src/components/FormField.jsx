import React from 'react';
import '../stylesheets/admin-main-page.css'

const FormField = ({ label, name, type, onChange, onBlur, value }) => {
    return (
        <div className="form-field">
            <label htmlFor={label}>{name}</label>
            {type === 'textarea' ? (
                <textarea name={label} id={label} onChange={onChange} onBlur={onBlur} value={value}  className="custom-textarea" rows="4"/>
            ) : (
                <input name={label} id={label} type={type} onChange={onChange} onBlur={onBlur} value={value} />
            )}
        </div>
    );
};

FormField.defaultProps = {
    type: 'text',
    onChange: () => {},
    onBlur: () => {},
    value: ''
};

export default FormField;