import axios from "axios";
import { useEffect, useState } from "react";


const ManageUsersPage = () => {

    const [users, setUsers] = useState([])
    

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchUsers();
    })

    return (
        <div className='manage-users-page'>
        <h1>Użytkownicy</h1>
        <div className='users-list'>
            {users.map(user => (
                <div key={user.id} className='user-info'>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    </div>
    );
}

export default ManageUsersPage;