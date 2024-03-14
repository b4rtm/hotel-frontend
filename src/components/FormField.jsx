const FormField = ({label, name, type}) =>  {
    return (
        <div className="form-field">
            <label htmlFor={label}>{name}</label>
            <input name={label} id={label} type={type} required/>
        </div>
    );
}

export default FormField;