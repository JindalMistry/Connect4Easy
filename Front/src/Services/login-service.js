import axios from "axios";
// const url = "http://localhost:8080/";
// const url = "http://192.168.100.43:8080/";
const url = "http://192.168.1.6:8080/";

export const register = (data) => {
    let apiUrl = url + "auth/register";
    return axios.post(apiUrl, data);
};
export const login = (data) => {
    let apiUrl = url + "auth/login";
    return axios.post(apiUrl, data);
};
export const logout = (username) => {
    let apiUrl = url + 'auth/logout/' + username;
    return axios.get(apiUrl);
};