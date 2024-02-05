import axios from "axios";
// const url = "http://localhost:8080/";
const url = "";

export const getConnections = (username) => {
    let apiUrl = url + "friends/" + username;
    return axios.get(apiUrl);
};

export const searchConnection = (search, user) => {
    let apiUrl = url + "/friends/search/" + search + "/" + user;
    return axios.get(apiUrl);
};

export const addConnection = (para) => {
    let apiUrl = url + "friends/addConnection";
    return axios.post(apiUrl, para);
};

export const acceptConnection = (para, type) => {
    let apiUrl = url + "/friends/acceptConnection/" + type;
    return axios.post(apiUrl, para);
};

export const pushNotification = (para) => {
    let apiUrl = url + "user/pushNotification";
    return axios.post(apiUrl, para);
};

export const pullNotification = (para) => {
    let apiUrl = url + "user/pullNotification";
    return axios.post(apiUrl, para);
};

export const updateNotification = (para) => {
    let apiUrl = url + "user/updateNotification";
    return axios.post(apiUrl, para);
};

export const getNotifications = (username) => {
    let apiUrl = url + 'user/getNotification/' + username;
    return axios.get(apiUrl);
};

export const sendChallenge = (obj) => {
    let apiUrl = url + 'friends/sendChallenge';
    return axios.post(apiUrl, obj);
};

export const acceptChallenge = (obj) => {
    let apiUrl = url + 'friends/acceptChallenge';
    return axios.post(apiUrl, obj);
};

export const declineChallenge = (obj) => {
    let apiUrl = url + 'friends/declineChallenge';
    return axios.post(apiUrl, obj);
};

export const startGame = (username, opp, type) => {
    let apiUrl = url + "friends/manage-game-status/" + username + "/" + opp + "/" + type;
    return axios.get(apiUrl);
};