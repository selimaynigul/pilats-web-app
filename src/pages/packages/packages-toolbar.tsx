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
import { Form, message } from "antd";
import { CompanyDropdown } from "components";
import moment from "moment";
import { getBranchId, getCompanyId, hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";

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

  @media (max-width: 768px) {
    display: none;
  }
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

  @media (max-width: 768px) {
    margin-left: auto;
  }
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
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddPackage = (values: any) => {
    const payload = {
      name: values.name, // Map the name field
      description: values.description, // Map the description field
      price: values.price ? parseFloat(values.price) : null, // Ensure price is a valid BigDecimal
      discount: values.discount ? parseFloat(values.discount) : null, // Ensure discount is a valid BigDecimal
      bonusCount: parseInt(values.bonusCount, 10) || 0, // Map bonus count, defaulting to 0 if not provided
      changeCount: parseInt(values.changeCount, 10) || 0, // Map change count, defaulting to 0 if not provided
      creditCount: parseInt(values.creditCount, 10) || 0, // Map credit count, defaulting to 0 if not provided
      companyId: hasRole(["ADMIN"])
        ? parseInt(values.companyId, 10)
        : getCompanyId(),
      isBranchSpecific:
        hasRole(["BRANCH_ADMIN"]) || values.branchId ? true : false,
      branchId: hasRole(["BRANCH_ADMIN"])
        ? getBranchId()
        : values.branchId
          ? parseInt(values.branchId, 10)
          : null,
    };

    setLoading(true);
    companyPackageService
      .add(payload)
      .then(() => {
        setIsModalVisible(false);
        message.success("Package is added");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error adding package:", err);
        handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{packageCount}</CountNumber> {t.packagesListed}
      </CountContainer>
      <ActionContainer>
        {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
          <CompanyDropdown
            selectedItem={selectedCompany}
            onSelect={(company) => setSelectedCompany(company)}
          />
        )}
        <AddButton onClick={() => setIsModalVisible(true)} />
      </ActionContainer>
      <AddPackageForm
        form={form}
        visible={isModalVisible}
        loading={loading}
        onClose={() => {
          setIsModalVisible(false);
        }}
        onSubmit={handleAddPackage}
      />
    </ToolbarContainer>
  );
};

export default PackagesToolbar;
