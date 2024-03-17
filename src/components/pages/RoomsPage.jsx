import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/rooms-page.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    }, []); 

    const navigateTo = useNavigate();
    const goToRoomDetails = (roomId) => {
        navigateTo('/rooms/' + roomId)
    };

    return(
        <>
            <Navbar/>
            <div className='rooms-page'>
                <h1>Pokoje i apartamenty</h1>
                <div className='rooms-list'>
                    {rooms.map(room => (
                        <div key={room.id} className='room-card' onClick={() => goToRoomDetails(room.id)}>
                            <img src={room.imagePath}/>
                            <p>{room.name}</p>
                            <p>{room.pricePerNight} zł</p>

                            <button>Rezerwuj pokój</button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default RoomsPage;