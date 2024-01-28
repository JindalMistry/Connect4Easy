import axios from "axios"
const url = "http://localhost:8080/";
export const register = (data) => {
    let apiUrl = url + "auth/register"
    return axios.post(apiUrl, data);
}
export const login = (data) => {
    let apiUrl = url + "auth/login";
    return axios.post(apiUrl, data);
}