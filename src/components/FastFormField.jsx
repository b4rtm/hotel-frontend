import React from 'react';
import '../stylesheets/admin-main-page.css'
import '../stylesheets/register-page.css';

import { FastField } from 'formik';

const FastFormField = ({ label, name, type }) => {
    return (
        <div className="form-field">
            <label htmlFor={name}>{label}</label>
            <FastField name={name}>
                {({ field, meta }) => (
                    <div>
                        {type === 'textarea' ? (
                            <textarea {...field} id={name} className="custom-textarea" rows="4" />
                        ) : (
                            <input {...field} id={name} type={type} />
                        )}
                        {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
                    </div>
                )}
                
            </FastField>
        </div>
    );
};


FastFormField.defaultProps = {
    type: 'text',
    onChange: () => {},
    onBlur: () => {},
    value: ''
};

export default FastFormField;