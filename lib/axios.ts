import axios from 'axios';
import {retrieveRawInitData } from "@tma.js/bridge";

export const api = axios.create({
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = retrieveRawInitData();

    if (token) {
        config.headers.Authorization = `tma ${token}`;
    }

    return config;
});
