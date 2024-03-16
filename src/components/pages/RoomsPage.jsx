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
                        <a key={room.id} className='room-card'>
                            <img src={room.imagePath}/>
                            <p>{room.name}</p>
                            <p>{room.pricePerNight} zł</p>

                            <button>Rezerwuj pokój</button>
                        </a>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default RoomsPage;