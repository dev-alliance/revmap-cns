// src/api/axiosInstance.ts
import axios from "axios";

const baseURL = axios.create({
  baseURL: "http://localhost:1337", // Your API base URL
});
// const baseURL = axios.create({
//   baseURL: "https://cns-l8g7.onrender.com", // Your API base URL
// });

//

export default baseURL;
