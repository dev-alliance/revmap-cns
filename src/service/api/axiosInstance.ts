// src/api/axiosInstance.ts
import axios from "axios";

const baseURL = axios.create({
  baseURL: "http://localhost:1337", // Your API base URL
});

export default baseURL;
