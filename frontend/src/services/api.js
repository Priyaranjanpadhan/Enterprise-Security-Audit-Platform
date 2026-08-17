import axios from "axios";

//creating an axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",//points to our backend express server
    withCredentials: true //this sends our secure session cookie with every request
});

export default api;
//https://api.priyaranjan.me/api -> for the server -> import.meta.env.VITE_API_URL
//http://localhost:3000/api -> for the local server checking   
//u might think that if VITE_API_URL always have a value like in local system we have the .env file that have the same value and then in server in the vercel we have api.priyaranjan.me/api why do we need after the or part. It's just a standard suppose we clone in some other computer, if we don't have this then it will crash so just a standar practice. 