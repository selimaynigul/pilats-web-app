import React, { useState } from "react";
import {
  ToolbarContainer,
  NavButtons,
  TitleButton,
  ActionButton,
  ToggleViewButton,
} from "./ToolbarStyles";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { DatePicker, Modal, Button, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import AddButton from "components/AddButton";
import { CompanyDropdown } from "components";
import { ToolbarProps, View } from "react-big-calendar";

const Toolbar: React.FC<
  ToolbarProps & { setCompany: any; setIsModalVisible: any }
> = ({
  label,
  onNavigate,
  onView,
  views,
  view,
  date,
  setCompany,
  setIsModalVisible,
}) => {
  const [selectedCompany, setSelectedCompany] = useState("MacFit - Gebze");
  const [form] = Form.useForm();

  const handleModalToggle = (visible: boolean) => {
    setIsModalVisible(visible);
    if (!visible) form.resetFields();
  };

  const handleClassSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        /*         console.log("Class Data:", values);
         */ handleModalToggle(false);
      })
      .catch((info) => console.log("Validation Failed:", info));
  };

  const trainerOptions = [
    { label: "Alice Johnson", value: "alice" },
    { label: "Bob Smith", value: "bob" },
    { label: "Charlie Brown", value: "charlie" },
  ];

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

      <CompanyDropdown
        selectedCompany={selectedCompany}
        onCompanySelect={(company) => {
          setSelectedCompany(company);
          setCompany(company);
        }}
      />

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
        <AddButton onClick={() => handleModalToggle(true)} />
      </NavButtons>
    </ToolbarContainer>
  );
};

export default Toolbar;
