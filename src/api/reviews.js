import axios from "axios";

export const postReview = async (values) => {
    try {
        await axios.post('http://localhost:8080/reviews', values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }});;
        } catch (error) {
        console.error('Error posting booking:', error);
    }
};