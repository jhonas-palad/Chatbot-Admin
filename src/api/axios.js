import axios from 'axios';

const DEPLOYMENT_URL = 'https://chatbotapi.site/';
export default axios.create({
    baseURL: DEPLOYMENT_URL
});

export const axiosPrivate = axios.create({
    baseURL: DEPLOYMENT_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})
