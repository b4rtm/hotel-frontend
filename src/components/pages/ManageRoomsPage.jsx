import axios from "axios";
import '../../stylesheets/register-page.css';
import { useEffect, useState } from "react";
import "../../stylesheets/admin-main-page.css"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../FormField';
import Modal from 'react-modal';
import { deleteRoom, fetchRooms, postRoom, putRoom } from "../../api/rooms";

const ManageRoomsPage = () => {
    const [rooms, setRooms] = useState([])
    const [currentRoom, setCurrentRoom] = useState(null)


    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    
    const handleOpenConfirmation = (id) => {
        setIsConfirmationOpen(true);
        setSelectedRoomId(id);
    };
    
    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };
    
    const handleConfirmDeleteRoom = () => {
        handleCloseConfirmation();
        handleDeleteRoom(selectedRoomId);
    };

    const setDefaultFields = (room) =>{
        formik.setValues({ 
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            pricePerNight: room.pricePerNight,
            description: room.description,
        })
    }

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            capacity: '',
            pricePerNight: '',
            description: '',
            image: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Wpisz nazwę'),
            capacity: Yup.string().required('Wpisz pojemność'),
            pricePerNight: Yup.string().required('Wpisz cenę'),
            description: Yup.string().required('Wpisz opis'),
            image: Yup.mixed().required('Wybierz zdjęcie'), 
        }),
        onSubmit: async (values) => {
            if(currentRoom === 1){
                postRoom(values)
            }else{
                putRoom(currentRoom.id, values)
            }
            location.reload()
        },
    });
    

    useEffect(() => {

        const fetchData = async () => {
            const roomsData = await fetchRooms();
            setRooms(roomsData);
        }
        fetchData();
    }, [])


    const handleDeleteRoom = async (id) => {
        deleteRoom(id);
        location.reload()
    };

    const handleAddRoom = () => {
        setCurrentRoom(1);
        formik.resetForm();
    };

    const handleFileChange = (event) => {
        formik.setFieldValue("image", event.currentTarget.files[0]);
    };


    return (
        <div className='manage-users-page'>
            <h1>Zarządzaj pokojami</h1>

            <div className="content">
                <div className="fields">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nazwa</th>
                            <th>Cena</th>
                            <th>Pojemność</th>
                        </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.id} className='info'>
                                    <td>
                                        <p>{room.id}</p>
                                    </td>
                                    <td>
                                        <p>{room.name}</p>
                                    </td>
                                    <td>
                                        <p>{room.pricePerNight}</p>
                                    </td>
                                    <td>
                                        <p>{room.capacity}</p>
                                    </td>
                                    <td>
                                        <svg onClick={() => {setCurrentRoom(room); setDefaultFields(room)}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2em" height="2em" viewBox="0 0 50 50" fill="black"><title>Edytuj</title>
                                            <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                                        </svg>
                                    </td>
                                    <td>
                                        <svg onClick={() => handleOpenConfirmation(room.id)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2em" height="2em" viewBox="0 0 24 24" fill="black"><title>Usuń</title>
                                            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleAddRoom}>Dodaj nowy pokój</button>
                </div>
                {currentRoom != null && (
                    <div className="register-page">
                        <form  enctype="multipart/form-data" onSubmit={formik.handleSubmit}>
                            <FormField label="name" name="Nazwa" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                            {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}
                            <FormField label="capacity" name="Pojemność" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.capacity} />
                            {formik.touched.capacity && formik.errors.capacity && <p className="error">{formik.errors.capacity}</p>}
                            <FormField label="pricePerNight" name="Cena za noc" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pricePerNight} />
                            {formik.touched.pricePerNight && formik.errors.emapricePerNightil && <p className="error">{formik.errors.pricePerNight}</p>}
                            <FormField label="description" name="Opis pokoju" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} />
                            {formik.touched.description && formik.errors.description && <p className="error">{formik.errors.description}</p>}
                            <div className="form-field" >
                                <label htmlFor="image">Zdjęcie pokoju</label>
                                <input name="image" id="image" type="file" onChange={handleFileChange} onBlur={formik.handleBlur}/>
                            </div>
                            {formik.touched.image && formik.errors.image && <p className="error">{formik.errors.image}</p>}
                            {!formik.isValidating && <button type="submit">Zatwierdź</button>}
                            {!formik.isValid && formik.submitCount > 0 && <p className="error">Formularz zawiera błędy</p>}
                        </form>
                    </div>
                )}
            </div>
            <Modal className="modal" isOpen={isConfirmationOpen} onRequestClose={handleCloseConfirmation}>
                <p>Czy na pewno chcesz usunąć pokój?</p>
                <button className="delete" onClick={() => handleConfirmDeleteRoom(selectedRoomId)}>Tak</button>
                <button onClick={handleCloseConfirmation}>Anuluj</button>
            </Modal>
    </div>
    );
}

export default ManageRoomsPage