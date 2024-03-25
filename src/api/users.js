import axios from "axios";

export const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:8080/users');
        return response.data
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

export const postUser = async (values) => {
    try {
        const response = await axios.post('http://localhost:8080/rooms', values);
    } catch (error) {
        console.error('Error posting user:', error);
    }
};

export const putUser = async (id, values) => {
    try {
        const response = await axios.put('http://localhost:8080/users/' + id, values);
    } catch (error) {
        console.error('Error putting user:', error);
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete('http://localhost:8080/users/' + id);
        } catch (error) {
        console.error('Error deleting user:', error);
    }
};