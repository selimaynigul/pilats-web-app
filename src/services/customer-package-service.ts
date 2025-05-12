import { apiClient } from "config"; // Axios instance tanımının burada yapıldığını varsayıyoruz

const customerPackageService = {
  /**
   * Assigns a new customer package
   * @param data CustomerPackageAddRequest
   * @returns Promise<number>
   */
  assign: (data: any): Promise<number> => {
    return apiClient.post("/customerPackage", data);
  },

  /**
   * Retrieves customer packages using filters
   * @param params CustomerPackageSearchRequest
   * @returns Promise<CustomerPackageGetResponse[]>
   */
  search: (params: any): Promise<any[]> => {
    return apiClient
      .post("/customerPackage/search", params)
      .then((res) => res.data);
  },
  /**
   * Deletes a customer package by ID
   * @param id number
   */
  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/customerPackage/${id}`);
  },

  /**
   * Gets a customer package by ID
   * @param id number
   * @returns Promise<CustomerPackageGetResponse>
   */
  getById: (id: number): Promise<any> => {
    return apiClient.get(`/customerPackage/${id}`);
  },
};

export default customerPackageService;
