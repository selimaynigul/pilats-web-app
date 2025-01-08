import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddPackageForm from "./add-package-form/add-package-form";
import {
  companyAdminService,
  companyPackageService,
  trainerService,
} from "services";
import { handleError } from "utils/apiHelpers";
import { message } from "antd";
import { CompanyDropdown } from "components";
import moment from "moment";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const CountContainer = styled.div`
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  background: white;
  padding: 10px 20px;
  gap: 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  background: red;
  background: white;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;
`;

const CountNumber = styled.span`
  color: ${({ theme }) => theme.primary}; /* Primary color for the number */
`;

const PackagesToolbar: React.FC<{
  packageCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ packageCount, selectedCompany, setSelectedCompany }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleAddPackage = (values: any) => {
    const payload = {
      name: values.name, // Map the name field
      description: values.description, // Map the description field
      price: values.price ? parseFloat(values.price) : null, // Ensure price is a valid BigDecimal
      discount: values.discount ? parseFloat(values.discount) : null, // Ensure discount is a valid BigDecimal
      bonusCount: parseInt(values.bonusCount, 10) || 0, // Map bonus count, defaulting to 0 if not provided
      changeCount: parseInt(values.changeCount, 10) || 0, // Map change count, defaulting to 0 if not provided
      creditCount: parseInt(values.creditCount, 10) || 0, // Map credit count, defaulting to 0 if not provided
      companyId: parseInt(values.companyId, 10), // Ensure companyId is a valid integer
      isBranchSpecific: values.isBranchSpecific === true, // Map isBranchSpecific field
      branchId: values.branchId ? parseInt(values.branchId, 10) : null, // Optional branchId
    };

    companyPackageService
      .add(payload)
      .then(() => {
        message.success("Package is added");
        setIsModalVisible(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error adding package:", err);
        handleError(err);
      });
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{packageCount}</CountNumber> packages listed
      </CountContainer>
      <ActionContainer>
        <CompanyDropdown
          selectedItem={selectedCompany}
          onSelect={(company) => setSelectedCompany(company)}
        />
        <AddButton onClick={() => setIsModalVisible(true)} />
      </ActionContainer>
      <AddPackageForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddPackage}
      />
    </ToolbarContainer>
  );
};

export default PackagesToolbar;
