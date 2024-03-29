import '../../../stylesheets/register-page.css';
import { useEffect, useState } from "react";
import "../../../stylesheets/admin-main-page.css"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../FormField';
import Modal from 'react-modal';
import { fetchUsers, putUser } from "../../../api/users";


const ManageUsersPage = () => {

    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    
    const handleOpenConfirmation = (userId) => {
        setIsConfirmationOpen(true);
        setSelectedUserId(userId);
    };
    
    
    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };
    
    const handleConfirmDeleteUser = () => {
        handleCloseConfirmation();
        handleDeleteUser(selectedUserId);
    };

    const setDefaultFields = (user) =>{
        formik.setValues({ 
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            city: user.city,
            postCode: user.postCode,
            pesel: user.pesel,
        })
    }

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            address: '',
            city: '',
            postCode: '',
            pesel: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Wpisz imię'),
            surname: Yup.string().required('Wpisz nazwisko'),
            email: Yup.string().email('Niepoprawny adres email').required('Wpisz email'),
            phoneNumber: Yup.string().matches(/^[\d+\s]+$/, 'Niepoprawny format numeru telefonu').required('Wpisz numer telefonu'),
            address: Yup.string().required('Wpisz adres'),
            city: Yup.string().required('Wpisz miasto'),
            postCode: Yup.string().matches(/^\d{2}-\d{3}$/, 'Niepoprawny format kodu pocztowego').required('Wpisz kod pocztowy'),
            pesel: Yup.string().matches(/^\d{11}$/, 'Niepoprawny format numeru PESEL').required('Wpisz pesel'),
        }),
        onSubmit: async (values) => {
          putUser(currentUser.id, values);
          location.reload();
        },
    });
    

    useEffect(() => {
        const fetchData = async () => {
            const usersData = await fetchUsers();
            setUsers(usersData);
        }
        fetchData();
    }, [])


    const handleDeleteUser = async (userId) => {
        deleteUser(userId);
        location.reload();
    };


    return (
        <div className='manage-page'>
            <h1>Zarządzaj użytkownikami</h1>

            <div className="content">
                <div className="fields">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className='info'>
                                    <td>
                                        <p>{user.id}</p>
                                    </td>
                                    <td>
                                        <p>{user.name}</p>
                                    </td>
                                    <td>
                                        <p>{user.surname}</p>
                                    </td>
                                    <td>
                                        <p>{user.email}</p>
                                    </td>
                                    <td>
                                        <svg onClick={() => {setCurrentUser(user); setDefaultFields(user)}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2em" height="2em" viewBox="0 0 50 50" fill="black"><title>Edytuj</title>
                                            <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                                        </svg>
                                    </td>
                                    <td>
                                        <svg onClick={() => handleOpenConfirmation(user.id)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2em" height="2em" viewBox="0 0 24 24" fill="black"><title>Usuń</title>
                                            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {currentUser != null && (
                    <div className="register-page">
                        <form onSubmit={formik.handleSubmit}>
                            <FormField label="name" name="Imię" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                            {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}
                            <FormField label="surname" name="Nazwisko" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.surname} />
                            {formik.touched.surname && formik.errors.surname && <p className="error">{formik.errors.surname}</p>}
                            <FormField label="email" name="Email" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
                            <FormField label="phoneNumber" name="Numer telefonu" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phoneNumber} />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="error">{formik.errors.phoneNumber}</p>}
                            <FormField label="address" name="Adres" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.address} />
                            {formik.touched.address && formik.errors.address && <p className="error">{formik.errors.address}</p>}
                            <FormField label="city" name="Miasto" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city} />
                            {formik.touched.city && formik.errors.city && <p className="error">{formik.errors.city}</p>}
                            <FormField label="postCode" name="Kod pocztowy" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.postCode} />
                            {formik.touched.postCode && formik.errors.postCode && <p className="error">{formik.errors.postCode}</p>}
                            <FormField label="pesel" name="PESEL" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pesel} />
                            {formik.touched.pesel && formik.errors.pesel && <p className="error">{formik.errors.pesel}</p>}
                            {!formik.isValidating && <button type="submit">Zatwierdź zmiany</button>}
                            {!formik.isValid && formik.submitCount > 0 && <p className="error">Formularz zawiera błędy</p>}
                        </form>
                    </div>
                )}
            </div>
            <Modal className="modal" isOpen={isConfirmationOpen} onRequestClose={handleCloseConfirmation} contentLabel="Potwierdź usunięcie użytkownika">
                <p>Czy na pewno chcesz usunąć użytkownika?</p>
                <button className="delete" onClick={() => handleConfirmDeleteUser(selectedUserId)}>Tak</button>
                <button onClick={handleCloseConfirmation}>Anuluj</button>
            </Modal>
    </div>
    );
}

export default ManageUsersPage;