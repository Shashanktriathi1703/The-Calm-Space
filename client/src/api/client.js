import axios from "axios";

// Set VITE_API_URL in client/.env for production, e.g. https://api.yourdomain.com/api
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL });

export default api;
