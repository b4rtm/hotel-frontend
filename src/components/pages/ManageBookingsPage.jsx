import axios from "axios";
import '../../stylesheets/register-page.css';
import { useEffect, useState } from "react";
import "../../stylesheets/admin-main-page.css"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../FormField';
import Modal from 'react-modal';
import { fetchUsers, postUser } from "../../api/users";


const ManageBookingsPage = () => {

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

    const handleAddBooking = () => {
        setCurrentRoom(1);
        formik.resetForm();
    };

    return (
        <div className='manage-page'>
            <h1>Zarządzaj rezerwacjami</h1>

            <div className="content">
                <div className="fields">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data ropoczęcia</th>
                            <th>Data zakończenia</th>
                            <th>ID klienta</th>
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
                                        <svg onClick={() => handleOpenConfirmation(user.id)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2em" height="2em" viewBox="0 0 24 24" fill="black"><title>Usuń</title>
                                            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleAddBooking}>Dodaj nowy pokój</button>
                </div>
                {currentUser != null && (
                    <div className="register-page">
                        <form onSubmit={formik.handleSubmit}>
                            <FormField label="name" name="Data rozpoczęcia" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                            {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}
                            <FormField label="surname" name="Data zakończenia" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.surname} />
                            {formik.touched.surname && formik.errors.surname && <p className="error">{formik.errors.surname}</p>}
                            <FormField label="email" name="Email" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
                            <FormField label="phoneNumber" name="Numer telefonu" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phoneNumber} />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="error">{formik.errors.phoneNumber}</p>}
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

export default ManageBookingsPage;