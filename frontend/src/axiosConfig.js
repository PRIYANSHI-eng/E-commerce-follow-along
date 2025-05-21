import axios from 'axios';
  
const instance = axios.create({
    baseURL: 'http://localhost:3000', // your server
    withCredentials: true, // crucial for sending cookies
});

// Add a request interceptor to handle authentication
instance.interceptors.request.use(
    function (config) {
        // Get token from localStorage if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token from login response
instance.interceptors.response.use(
    function (response) {
        // If this is a login response, save the token
        if (response.config.url === '/api/v2/user/login' && response.data.success) {
            // Store token in localStorage for future requests
            localStorage.setItem('token', response.data.token);
        }
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);
  
export default instance;