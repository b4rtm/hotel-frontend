import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/rooms-page.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

const RoomsPage = () =>{

    const [rooms, setRooms] = useState([]);

    useEffect(() => {

        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []); // Pusta zależność oznacza, że useEffect będzie wywołany tylko raz, po załadowaniu komponentu


    return(
        <>
            <Navbar/>
            <div className='rooms-page'>
                <h1>Pokoje i apartamenty</h1>
                <div className='rooms-list'>
                    {rooms.map(room => (
                        <div key={room.id} className='room-item'>
                            <h2>{room.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default RoomsPage;