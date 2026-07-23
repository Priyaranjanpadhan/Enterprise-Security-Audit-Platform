import axios from "axios";

//creating an axios instance
const api = axios.create({
    baseURL: "http://localhost:3000/api",//points to our backend express server
    withCredentials: true //this sends our secure session cookie with every request
});

export default api;