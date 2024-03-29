import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/rooms-page.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../../api/rooms';

const RoomsPage = () => {

    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const roomsData = await fetchRooms();
            setRooms(roomsData);
        }
        fetchData();
    }, []);

    const navigateTo = useNavigate();
    const goToRoomDetails = (roomId) => {
        navigateTo('/rooms/' + roomId);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRooms = rooms.filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const roomsPerPage = 6;
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Navbar />
            <div className='rooms-page'>
                <h1>Pokoje i apartamenty</h1>
                <input className="search-input" type="text" placeholder="Wyszukaj pokój..." value={searchTerm} onChange={handleSearchChange} />
                <div className='rooms-list'>
                    {currentRooms.map(room => (
                        <div key={room.id} className='room-card' onClick={() => goToRoomDetails(room.id)}>
                            <img src={room.imagePath} alt={room.name} />
                            <p>{room.name}</p>
                            <p>{room.pricePerNight} zł</p>
                            <button>Rezerwuj pokój</button>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    {Array.from({ length: Math.ceil(filteredRooms.length / roomsPerPage) }, (_, i) => (
                        <div key={i} className={currentPage === i + 1 ? 'active' : ''}  onClick={() => paginate(i + 1)}>{i + 1}</div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RoomsPage;
