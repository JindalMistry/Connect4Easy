import axios from "axios";
//const url = "http://localhost:8080/";
const url = "";

export const getConnections = (username) => {
    let apiUrl = url + "friends/" + username;
    return axios.get(apiUrl);
};

export const searchConnection = (search) => {
    let apiUrl = url + "/friends/search/" + search;
    return axios.get(apiUrl);
};

export const addConnection = (para) => {
    let apiUrl = url + "friends/addConnection";
    return axios.post(apiUrl, para);
};

export const acceptConnection = (para) => {
    let apiUrl = url + "/friends/acceptConnection";
    return axios.post(apiUrl, para);
};