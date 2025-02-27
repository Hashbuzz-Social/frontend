import { base_URL } from "../Utilities/helpers";
import axios from 'axios';
export const APICall = async (url, method, header, data, isImage = false, token) => {
    if (isImage) {
        return await axios({
            url: base_URL + url,
            method: method,
            data: data,
            headers: {
                Authorization: `Token ${token}`
            },
            "mode": "cors"
        });
    }
    else if (method === 'POST') {
        return await axios({
            url: base_URL + url,
            method: method,
            data: data,
            headers: {
                Authorization: `Token ${token}`
            },
            "mode": "cors"
        });
    }
    else if (method === 'GET') {
        return await axios({
            url: base_URL + url,
            method: method,
            headers: {
                Authorization: `Token ${token}`
            },
            "mode": "cors"
        });
    }
    else if (method === 'PATCH') {
        return await axios({
            url: base_URL + url,
            method: method,
            headers: {
                Authorization: `Token ${token}`
            },
            data: data,
            "mode": "cors"
        });
    }
}

export const APIAuthCall = async (url, method, header, data,token) => {
    let headers = {
        Authorization: `Token ${token}`
    }
    if (method === 'GET') {
        return await axios({
            url: base_URL + url,
            method: method,
            headers: token?headers:{},
            "mode": "cors"
        });
    }
}