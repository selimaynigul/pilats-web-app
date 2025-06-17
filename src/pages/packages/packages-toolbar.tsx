import React, { useState } from "react";
import AddPackageForm from "./add-package-form/add-package-form";
import { companyPackageService } from "services";
import { handleError } from "utils/apiHelpers";
import { Form, message } from "antd";

import { getBranchId, getCompanyId, hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import EntityToolbar from "components/EntityToolbar";

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
    <>
      <EntityToolbar
        count={packageCount}
        entityLabel={t.packagesListed}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        onAddClick={() => setIsModalVisible(true)}
        showCompanyDropdown={hasRole(["ADMIN", "COMPANY_ADMIN"])}
      />
      <AddPackageForm
        form={form}
        visible={isModalVisible}
        loading={loading}
        onClose={() => {
          setIsModalVisible(false);
        }}
        onSubmit={handleAddPackage}
      />
    </>
  );
};

export default PackagesToolbar;
