import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // important for auth later
  headers: {
    Accept: "application/json",
  },
});

export default api;
