import axios from 'axios';

// const PUBLIC_URL = 'https://chatbotapi.site/';
const PUBLIC_URL = 'http://127.0.0.1:8000';
export default axios.create({
    baseURL: PUBLIC_URL
});

export const axiosPrivate = axios.create({
    baseURL: PUBLIC_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})
