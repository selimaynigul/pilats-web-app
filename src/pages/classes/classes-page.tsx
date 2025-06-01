import React, { useEffect, useState } from "react";
import Scheduler from "../../components/scheduler/Scheduler";
import { Helmet } from "react-helmet";
import { useLanguage } from "hooks";
import { useSearchParams } from "react-router-dom";
import { hasRole } from "utils/permissionUtils";
import { companyService, branchService } from "services";

const ClassesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [company, setCompany] = useState<any>({
    companyName: hasRole(["COMPANY_ADMIN"])
      ? t.selectBranch
      : searchParams.get("company")
        ? "Loading"
        : t.selectCompany,
    id: searchParams.get("company"),
    branchParam: searchParams.get("branch") || null,
    companyParam: searchParams.get("company") || null,
  });

  useEffect(() => {
    const params: any = {};
    if (company.id) params.company = company?.companyId || company.id;
    if (company.branchParam || company.branchName)
      params.branch =
        company.branchParam || (company.branchName ? company.id : null);
    setSearchParams(params);
  }, [company]);

  useEffect(() => {
    const fetchDetails = async () => {
      let updatedCompanyName = company.companyName;
      let branchName = "";

      if (company.companyParam) {
        try {
          const response = await companyService.search({
            id: company.companyParam,
          });
          const companyData = response?.data[0];
          updatedCompanyName =
            companyData?.companyName || updatedCompanyName || t.selectCompany;
        } catch (error) {
          console.error("Error fetching company name:", error);
        }
      }

      if (company.companyParam && company.branchParam) {
        try {
          const branchResponse = await branchService.search({
            id: company.branchParam,
          });
          const branchData = branchResponse?.data[0];
          branchName = branchData?.branchName || "";
        } catch (error) {
          console.error("Error fetching branch name:", error);
        }
      }

      setCompany((prev: any) => ({
        ...prev,
        companyName: branchName
          ? `${updatedCompanyName} - ${branchName}`
          : updatedCompanyName,
      }));
    };

    fetchDetails();
  }, [company.companyParam, company.branchParam]);

  return (
    <>
      <Helmet>
        <title>Pilats - {t.sessions}</title>
      </Helmet>
      <Scheduler selectedCompany={company} setSelectedCompany={setCompany} />
    </>
  );
};

export default ClassesPage;
