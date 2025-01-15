import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://193.140.134.43/tomcat/platesapi/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
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
/* apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  }
);
 */
export default apiClient;
