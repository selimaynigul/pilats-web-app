export interface Report {
  id: number;
  userId: number;
  companyId: number | null;
  branchId: number | null;
  userEmail: string;
  userRole: string;
  changeDate: string;
  entityName: string;
  operation: string;
  previousEntityJson: object | null;
  updatedEntityJson: object | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}