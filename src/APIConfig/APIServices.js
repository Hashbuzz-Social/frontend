import { base_URL } from "../Utilities/Constant";
import axios from 'axios';

export const APICall = async (url, method, header, data) => {
    if (method === 'POST') {
        return await axios({
            url: base_URL + url,
            method: method,
            data: data,
            headers: header,
            "mode": "cors"
        });
    }
    else if (method === 'GET') {
        return await axios({
            url: base_URL + url,
            method: method,
            headers: header,
            "mode": "cors"
        });
    }
}