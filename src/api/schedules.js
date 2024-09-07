import axios from "axios";


export const postSchedule = async (values) => {
    try {
        const response = await axios.post('http://localhost:8080/schedules', values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
    } catch (error) {
        console.error('Error posting schedule:', error);
    }
};

export const fetchSchedules = async () => {
    try {
        const response = await axios.get('http://localhost:8080/schedules', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
            console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
};