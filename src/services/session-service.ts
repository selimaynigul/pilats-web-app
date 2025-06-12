import { apiClient } from "config";

const sessionService = {
  add: (params = {}) => apiClient.post("/session", params),

  update: (params = {}) => apiClient.put("/session", params),

  delete: (id: number) => apiClient.delete(`/session/${id}`),

  search: (params = {}) => apiClient.post("/session/search", params),

  getById: (id: number) => apiClient.get(`/session/${id}`),

  getCustomerSessions: (params = {}) =>
    apiClient.post("/session/searchWithCustomerLastEvent", params),

  getSessionCustomers: (params = {}) =>
    apiClient.post("/session/searchCustomers", params),

  join: (params = {}) => apiClient.post("/session/joinSession", params),

  unjoin: (params = {}) => apiClient.post("/session/unjoinSession", params),

  markAsAttended: (params = {}) =>
    apiClient.post("/session/markCustomerAsAttended", params),

  markAsUnattended: (params = {}) =>
    apiClient.post("/session/markCustomerAsUnattended", params),
};

export default sessionService;
