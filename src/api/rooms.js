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
    formData.append('descriptionEn', values.descriptionEn);

    values.newImages.forEach((image, index) => {
        formData.append('newImages', image.file);
    });
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

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('capacity', values.capacity);
    formData.append('pricePerNight', values.pricePerNight);
    formData.append('description', values.description);
    formData.append('descriptionEn', values.descriptionEn);

    values.newImages.forEach((image, index) => {
        formData.append('newImages', image.file);
    });
    try {
        console.log(values)
        const response = await axios.put('http://localhost:8080/rooms/' + id, formData, {
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

export const deleteRoomImage = async (roomId, imageUrl) => {
    try {
        const response = await axios.delete(`http://localhost:8080/rooms/${roomId}/images`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: {
                imageUrl: imageUrl
            }
        });
        } catch (error) {
        console.error('Error deleting room:', error);
    }
};