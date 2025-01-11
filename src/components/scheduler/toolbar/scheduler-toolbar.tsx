import React from "react";
import {
  ToolbarContainer,
  NavButtons,
  TitleButton,
  ActionButton,
  ToggleViewButton,
} from "./ToolbarStyles";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Form } from "antd";
import dayjs from "dayjs";
import AddButton from "components/AddButton";
import { CompanyDropdown } from "components";
import { ToolbarProps, View } from "react-big-calendar";
import { hasRole } from "utils/permissionUtils";

const Toolbar: React.FC<
  ToolbarProps & { company: any; setCompany: any; setIsModalVisible: any }
> = ({
  onNavigate,
  onView,
  views,
  view,
  date,
  setCompany,
  company,
  setIsModalVisible,
}) => {
  const [form] = Form.useForm();

  const handleModalToggle = (visible: boolean) => {
    setIsModalVisible(visible);
    if (!visible) form.resetFields();
  };

  const viewArray = Array.isArray(views)
    ? views
    : (Object.keys(views).filter(
        (key) => views[key as keyof typeof views]
      ) as View[]);

  return (
    <ToolbarContainer>
      <NavButtons>
        <ToggleViewButton onClick={() => onNavigate("TODAY")}>
          Today
        </ToggleViewButton>
        <ActionButton onClick={() => onNavigate("PREV")}>
          <LeftOutlined />
        </ActionButton>
        <ActionButton onClick={() => onNavigate("NEXT")}>
          <RightOutlined />
        </ActionButton>
        <TitleButton>{dayjs(date).format("MMMM YYYY")}</TitleButton>
      </NavButtons>
      <div>
        {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
          <CompanyDropdown
            selectedItem={company}
            onSelect={(selectedCompany) => setCompany(selectedCompany)}
          />
        )}
      </div>
      <NavButtons>
        {viewArray.map((v: any) => (
          <ToggleViewButton
            key={v}
            onClick={() => onView(v)}
            style={{ fontWeight: view === v ? "bold" : "normal" }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </ToggleViewButton>
        ))}
        {hasRole(["BRANCH_ADMIN"]) && (
          <AddButton onClick={() => handleModalToggle(true)} />
        )}
      </NavButtons>
    </ToolbarContainer>
  );
};

export default Toolbar;
