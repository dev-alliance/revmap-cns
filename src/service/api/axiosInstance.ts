import axios from "axios";

// const baseURL = axios.create({
//   baseURL: "http://localhost:1337",

const baseURL = axios.create({
  baseURL: "http://api.contractnsign.com",
  // baseURL: "http://localhost:1337",

});

export default baseURL;

// import axios from "axios";

// const baseURL =
//   process.env.NODE_ENV === "productionssscccc"
//     ? process.env.REACT_APP_API_BASE_URL_ggPROD
//     : process.env.REACT_APP_API_BASE_URL_LOCAL;

// const axiosInstance = axios.create({ baseURL });

// export default axiosInstance;
