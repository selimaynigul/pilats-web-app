import axios from "axios";

const baseURL = "https://uat-platesapi-latest.onrender.com/api/v1";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000000,
});

//  request interceptor to include the token in the headers
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

// response interceptor to handle token-related errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 403 &&
      error.config &&
      error.config.method === "get"
    ) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
