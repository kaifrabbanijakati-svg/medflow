import axios from "axios";

const api = axios.create({
  baseURL: "https://medflow-aow2.onrender.com"
});

export default api;