import axios from 'axios';

/**
 * An Axios instance configured to make requests to the '/api' base URL.
 * It automatically sets the 'Content-Type' header to 'application/json'.
 */
const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
