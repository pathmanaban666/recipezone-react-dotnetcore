import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

// Automatically attach token from localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization= token ? `Bearer ${token}` : '' 

    } else {
      console.log("No token found"); 
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default instance;
