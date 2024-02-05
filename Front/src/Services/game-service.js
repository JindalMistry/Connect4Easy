import axios from "axios";
const url = "";

export const assignIcons = (obj) => {
    let apiUrl = url + "manage-player-icons";
    return axios.post(apiUrl, obj);
};
export const sendMove = (obj, Id) => {
    let apiUrl = url + "manage-player-move/" + Id;
    return axios.post(apiUrl, obj);
};
export const updateGameStatus = (gameId, userId) => {
    let apiUrl = url + "update-game-status/" + gameId + "/" + userId;
    return axios.get(apiUrl);
};
export const manageExitGame = (username, opp) => {
    let apiUrl = url + "manage-exit-game/" + username + "/" + opp;
    return axios.get(apiUrl);
};
export const sendRematchRequest = (username, opp) => {
    let apiUrl = url + "manage-rematch-request/" + username + "/" + opp;
    return axios.get(apiUrl);
};
export const startRematch = (obj) => {
    let apiUrl = url + "start-rematch";
    return axios.post(apiUrl, obj);
};