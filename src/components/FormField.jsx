const FormField = ({label, name, type, onChange}) =>  {
    return (
        <div className="form-field" onChange={onChange}>
            <label htmlFor={label}>{name}</label>
            <input name={label} id={label} type={type} required/>
        </div>
    );
}

export default FormField;