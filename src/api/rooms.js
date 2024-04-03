import axios from "axios";

export const fetchRooms = async () => {
    try {
        const response = await axios.get('http://localhost:8080/rooms');
        return response.data
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
};

export const fetchRoom = async (id) => {
    try {

        const url = 'http://localhost:8080/rooms/' + id
        const response = await axios.get(url);
        return response.data
    } catch (error) {
        console.error('Error fetching room:', error);
    }
};

export const postRoom = async (values) => {

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('capacity', values.capacity);
    formData.append('pricePerNight', values.pricePerNight);
    formData.append('description', values.description);
    formData.append('image', values.image);

    try {
        const response = await axios.post('http://localhost:8080/rooms', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
    } catch (error) {
        console.error('Error posting room:', error);
    }
};

export const putRoom = async (id, values) => {
    try {
        const response = await axios.put('http://localhost:8080/rooms/' + id, values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
    } catch (error) {
        console.error('Error putting room:', error);
    }
};

export const deleteRoom = async (id) => {
    try {
        const response = await axios.delete('http://localhost:8080/rooms/' + id, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        } catch (error) {
        console.error('Error deleting room:', error);
    }
};