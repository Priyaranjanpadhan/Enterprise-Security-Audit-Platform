import axios from "axios";

//creating an axios instance
const api = axios.create({
    baseURL: "https://enterprise-security-audit-platform.onrender.com/api",//points to our backend express server
    withCredentials: true //this sends our secure session cookie with every request
});

export default api;
//https://enterprise-security-audit-platform.onrender.com/api -> for the server
//http://localhost:3000/api -> for the local server checking