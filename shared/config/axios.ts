import axios from 'axios';
import {retrieveRawInitData } from "@tma.js/bridge";
import {API_BASE_URL} from "@/shared/config/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = retrieveRawInitData();

    if (token) {
        config.headers.Authorization = `tma ${token}`;
    }

    return config;
});
