const FormField = ({label, name, type, onChange, onBlur, value}) =>  {
    return (
        <div className="form-field" >
            <label htmlFor={label}>{name}</label>
            <input name={label} id={label} type={type} onChange={onChange} onBlur={onBlur} value={value}/>
        </div>
    );
}

FormField.defaultProps = {
    type: 'text', 
    onChange: () => {}, 
    onBlur: () => {}, 
    value: ''
}

export default FormField;