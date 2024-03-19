const FormField = ({label, name, type, onChange, onBlur, value}) =>  {
    return (
        <div className="form-field" onChange={onChange} onBlur={onBlur} value={value}>
            <label htmlFor={label}>{name}</label>
            <input name={label} id={label} type={type} />
        </div>
    );
}

export default FormField;