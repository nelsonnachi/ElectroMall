import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://electromall.onrender.com" 
    : "", 
  withCredentials: true,
});

export default API;
