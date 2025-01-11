import React, { useEffect, useState } from "react";
import TrainerList from "./trainer-list/trainer-list";
import { Card } from "components";
import TrainersToolbar from "./trainers-toolbar";
import { hasRole } from "utils/permissionUtils";
import { useSearchParams } from "react-router-dom";
import { branchService, companyService } from "services";

const TrainersPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [company, setCompany] = useState<any>({
    companyName: hasRole(["COMPANY_ADMIN"])
      ? "Select Branch"
      : searchParams.get("company")
        ? "Loading"
        : "Select Company",
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

      // Fetch company name if companyParam exists
      if (company.companyParam) {
        try {
          const response = await companyService.search({
            id: company.companyParam,
          });
          const companyData = response?.data[0];
          updatedCompanyName =
            companyData?.companyName || updatedCompanyName || "All";
        } catch (error) {
          console.error("Error fetching company name:", error);
        }
      }

      // Fetch branch name only if companyParam exists
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

      // Update company state with combined name
      setCompany((prev: any) => ({
        ...prev,
        companyName: branchName
          ? `${updatedCompanyName} - ${branchName}`
          : updatedCompanyName,
      }));
    };

    fetchDetails();
  }, [company.companyParam, company.branchParam]);

  const updateTrainerCount = (count: number) => {
    setTrainerCount(count);
  };

  return (
    <Card
      toolbar={
        <TrainersToolbar
          trainerCount={trainerCount}
          selectedCompany={company}
          setSelectedCompany={setCompany}
        />
      }
    >
      <TrainerList
        onTrainerCountChange={updateTrainerCount}
        company={company}
      />
    </Card>
  );
};

export default TrainersPage;
