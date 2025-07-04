import React from "react";
import { Form, Input, InputNumber, Select, message } from "antd";
import { getCompanyId, getUser, hasRole } from "utils/permissionUtils";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import { useCompanyBranchSelect } from "hooks/useCompanyBranchSelect";
import { useLanguage } from "hooks";

interface AddPackageFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  form: any;
  loading: boolean;
}

const AddPackageForm: React.FC<AddPackageFormProps> = ({
  visible,
  onClose,
  onSubmit,
  form,
  loading,
}) => {
  const {
    companies,
    branches,
    companySearchLoading,
    branchLoading,
    searchCompanies,
    fetchBranches,
  } = useCompanyBranchSelect();

  const { t } = useLanguage();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        onSubmit(values);
      })
      .catch((info: any) => {
        message.error("Formu eksiksiz doldurun");
        console.error("Validation Failed:", info);
      });
  };
  const steps: CustomStep[] = [
    {
      label: t.packageDetails,
      buttonText: t.saveAndContinue,
      blocks: [
        {
          title: t.packageInfo,
          description: t.packageInfoDescription,
          fields: [
            <FormRow>
              <Form.Item
                name="name"
                rules={[{ required: true, message: t.pleaseEnterPackageName }]}
              >
                <Input placeholder={t.packageNamePlaceholder} />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[{ required: true, message: t.pleaseEnterPrice }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={999999}
                  placeholder={t.packagePricePlaceholder}
                />
              </Form.Item>
            </FormRow>,
            <Form.Item name="description">
              <Input.TextArea placeholder={t.description} />
            </Form.Item>,
          ],
        },
        {
          title: t.packageDetailsRequired,
          description: t.packageDetailsDescription,
          fields: [
            <FormRow>
              <Form.Item
                name="creditCount"
                rules={[{ required: true, message: t.pleaseEnterCreditCount }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder={t.creditCountPlaceholder}
                />
              </Form.Item>

              <Form.Item
                name="discount"
                initialValue={0}
                rules={[{ required: true, message: t.pleaseEnterDiscount }]}
              >
                <Select
                  placeholder={t.discountPlaceholder}
                  style={{ width: "100%" }}
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <Select.Option key={i * 10} value={i * 10}>
                      {i * 10}%
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </FormRow>,
            <FormRow>
              <Form.Item
                name="bonusCount"
                rules={[{ required: true, message: t.pleaseEnterBonusCount }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={t.bonusCountPlaceholder}
                />
              </Form.Item>

              <Form.Item
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.creditCount !== curValues.creditCount
                }
              >
                {({ getFieldValue }) => {
                  const creditCount = getFieldValue("creditCount");
                  return (
                    <Form.Item
                      name="changeCount"
                      rules={[
                        { required: true, message: t.pleaseEnterChangeCount },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        max={creditCount || 0}
                        disabled={!creditCount}
                        placeholder={t.changeCountPlaceholder}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </FormRow>,
          ],
        },
      ],
    },
    {
      label: t.companyInfo,
      buttonText: t.addPackage,
      blocks: [
        {
          title: t.companyInfo,
          description: t.companyInfoDescription,
          fields: [
            <Form.Item
              name="companyId"
              rules={[
                {
                  required: hasRole(["ADMIN"]),
                  message: t.pleaseSelectCompany,
                },
              ]}
            >
              <Select
                disabled={!hasRole(["ADMIN"])}
                showSearch
                placeholder={t.selectCompany + " *"}
                filterOption={false}
                onSearch={searchCompanies}
                onSelect={(value) => {
                  fetchBranches(value);
                  form.setFieldsValue({ branchId: undefined });
                }}
                loading={companySearchLoading}
                defaultValue={
                  hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"])
                    ? getUser().companyName
                    : undefined
                }
              >
                {companies.map((company: any) => (
                  <Select.Option key={company.id} value={company.id}>
                    {company.companyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>,
            <Form.Item name="branchId">
              <Select
                allowClear
                disabled={hasRole(["BRANCH_ADMIN"])}
                placeholder={t.selectBranch}
                loading={branchLoading}
                defaultValue={
                  hasRole(["BRANCH_ADMIN"]) ? getUser().branchName : undefined
                }
              >
                {branches.map((branch: any) => (
                  <Select.Option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>,
          ],
        },
      ],
    },
  ];

  return (
    <StepModal
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={t.addPackage}
      steps={steps}
      loading={loading}
      form={form}
    />
  );
};

export default AddPackageForm;
