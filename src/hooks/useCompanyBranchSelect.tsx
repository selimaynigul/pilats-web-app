import { useEffect, useState } from "react";
import { companyService, branchService } from "services";
import { hasRole, getCompanyId } from "utils/permissionUtils";

export function useCompanyBranchSelect() {
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  useEffect(() => {
    if (hasRole(["ADMIN"])) {
      searchCompanies("All");
    } else if (hasRole(["COMPANY_ADMIN"])) {
      fetchBranches(getCompanyId());
    }
  }, []);

  const searchCompanies = async (value: string) => {
    setCompanySearchLoading(true);
    try {
      const res = await companyService.search({
        companyName: value === "All" ? null : value,
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("Error searching companies:", err);
    } finally {
      setCompanySearchLoading(false);
    }
  };

  const fetchBranches = async (companyId: string) => {
    if (!companyId) return;
    setBranchLoading(true);
    try {
      const res = await branchService.search({ companyId });
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setBranchLoading(false);
    }
  };

  return {
    companies,
    branches,
    companySearchLoading,
    branchLoading,
    searchCompanies,
    fetchBranches,
  };
}
