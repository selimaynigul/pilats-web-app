import { apiClient } from "config";

const userService = {
  search: (params = {}) => apiClient.post("/customer/search", params),

  getById: (id: any) => apiClient.get(`/customer/${id}`),

  register: (params = {}) => apiClient.post("/customer", params),

  update: (data: any) => apiClient.put("/customer", data),

  delete: (id: any) => apiClient.delete(`/customer/${id}`),
};

export default userService;
