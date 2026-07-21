import axios from "axios";

const API = axios.create({
  baseURL: "https://campuscart-backend-u3i3.onrender.com",
});

export default API;