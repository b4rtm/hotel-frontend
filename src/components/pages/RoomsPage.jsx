import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/rooms-page.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../../api/rooms';

const RoomsPage = () =>{

    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const roomsData = await fetchRooms()
            setRooms(roomsData);
        }
        fetchData();
    }, []); 

    const navigateTo = useNavigate();
    const goToRoomDetails = (roomId) => {
        navigateTo('/rooms/' + roomId)
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRooms = rooms.filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return(
        <>
            <Navbar/>
            <div className='rooms-page'>
                <h1>Pokoje i apartamenty</h1>
                <input className="search-input" type="text" placeholder="Wyszukaj pokój..." value={searchTerm} onChange={handleSearchChange}/>
                <div className='rooms-list'>
                    
                    {
                    filteredRooms.map(room => (
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