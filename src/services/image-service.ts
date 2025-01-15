import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://prod-grad.onrender.com/api/v1",
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 5000,
});

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
const imageService = {
  postCompanyImage: (params = {}) => apiClient.post("/images/company", params),
  postTrainerImage: (params = {}) => apiClient.post("/images/trainer", params),
  postCustomerImage: (params = {}) => apiClient.post("/images/customer", params),
};

export default imageService;