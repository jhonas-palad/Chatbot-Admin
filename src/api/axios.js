import axios from 'axios';


const DEV_URL = 'http://127.0.0.1:8000';
const DEPLOYMENT_URL = 'http://139.162.105.247/';
export default axios.create({
    baseURL: DEPLOYMENT_URL
});

export const axiosPrivate = axios.create({
    baseURL: DEPLOYMENT_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})
