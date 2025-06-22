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

export interface ItemData {
  id: string;
  isActive?: boolean | null;
  imageUrl?: string | null;
  title: string;
  subtitle?: string | null;
  detailUrl?: string | null;

  company?: {
    id: string | null;
    name: string | null;
    location: string | null;
    branch?: string | null;
    imageUrl?: string | null;
  };

  contact?: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  };
}

export type ListItemType = "default" | "user" | "company";
