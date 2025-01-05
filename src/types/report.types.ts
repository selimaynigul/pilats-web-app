export interface Report {
    id: number;
    change_owner: string;
    change_date: string;
    entity_name: string;
    branchId: string;
    companyId: string;
    prev_json: object;
    updated_json: object;
    isSuccessful: boolean;
  }