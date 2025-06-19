import axios from "axios";

const baseURL =
  window.location.hostname.includes("localhost") && false
    ? "http://localhost:8000/api/v1"
    : "https://uat-platesapi-latest.onrender.com/api/v1";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000000,
});

// Add a request interceptor to include the token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser)?.token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token-related errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      /*    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      localStorage.clear();
      window.location.href = "/login"; */
    }

    return Promise.reject(error);
  }
);

export default apiClient;
