import axios from "axios";
import { useNavigate } from "react-router-dom";

export const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:8080/users', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        return response.data
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

export const fetchUser = async () => {
    if(localStorage.getItem('token')){
        try {
            const response = await axios.get('http://localhost:8080/users/getUser', {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                }});
            return response.data
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
};

export const postUser = async (values) => {
    try {
        const response = await axios.post('http://localhost:8080/rooms', values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
    } catch (error) {
        console.error('Error posting user:', error);
    }
};

export const putUser = async (id, values) => {
    try {
        const response = await axios.put('http://localhost:8080/users/' + id, values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
    } catch (error) {
        console.error('Error putting user:', error);
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete('http://localhost:8080/users/' + id, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        } catch (error) {
        console.error('Error deleting user:', error);
    }
};
