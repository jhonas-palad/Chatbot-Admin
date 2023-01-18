import axios from 'axios';
import appConfig from '../config/appConfig.json';
// const API_URL = 'https://chatbotapi.site/';

const urlConfig = appConfig.debug ? appConfig.debugConfig : appConfig.productionConfig;
export const API_URL = urlConfig.httpURL;
export const WS_URL = urlConfig.webSocketURL;

export default axios.create({
    baseURL: API_URL
});

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})
