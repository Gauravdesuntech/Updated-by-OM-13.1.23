import axios from 'axios';

export const ssoInstance = axios.create({
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        "Content-Type" : 'application/json'
    }
});
