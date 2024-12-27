import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Avatar,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Checkbox,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BsBuilding,
  BsEnvelopeFill,
  BsWhatsapp,
  BsPencil,
  BsTrash,
  BsPersonFillDash,
} from "react-icons/bs";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { trainerService } from "services";
import moment from "moment";

const Container = styled.div`
  background: white;
  border-radius: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 48px 24px;
  position: relative;
  overflow: hidden;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;
const ProfileSection = styled.div`
  text-align: center;
  max-height: 45%;
`;

const Name = styled.h2`
  font-size: 1.5em;
  margin: 10px 0 5px;
`;

const Title = styled.h4`
  font-size: 1.1em;
  color: gray;
  margin: 0;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 60%;
  padding: 0 32px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
  font-size: 1em;
  line-height: 1.5;

  span {
    font-weight: bold;
  }
`;

const ContactInfo = styled.div`
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  align-items: center;
  margin: 0 32px;
`;

const ContactButton = styled.div`
  height: 48px;
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e6e3ff;
  border-color: ${({ theme }) => theme.primary};
  border-radius: 50px;

  svg {
    color: ${({ theme }) => theme.primary};
  }

  font-size: 14px;
`;

const CompanyInfo = styled.div`
  border: 1px solid #f6f5ff;
  width: 90%;
  margin: auto;
  margin-top: 32px;
  height: 64px;
  padding: 12px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    div:nth-of-type(3) {
      opacity: 1;
    }
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const CompanyLogo = styled.div`
  background: #e6e3ff;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const CompanyName = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: black;
  }
  small {
    color: gray;
  }
`;
const AvatarContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: auto;
`;
const InactiveIcon = styled.div`
  background: #f54263;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: absolute;
  left: 15px;
  top: 4px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;

  &:before {
    content: "";
    background: white;
    width: 10px;
    height: 3px;
    border-radius: 10px;
  }
`;

const CompanyDetailButton = styled.div`
  background: transparent;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  opacity: 0;
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  color: gray;
`;

const EditButton = styled(Button)`
  border-radius: 10px;
  background: transparent;
  border: 1px solid white;
  width: 36px;
  height: 36px;
  color: grey;
  box-shadow: none;
  &:hover {
    background: transparent !important;
    color: grey !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  }
`;

const DeleteButton = styled(Button)`
  border-radius: 10px;
  background: transparent;
  border: 1px solid #f54263;
  width: 36px;
  height: 36px;
  color: #f54263;
  box-shadow: none;
  &:hover {
    background: #f54263 !important;
    color: white !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  }
`;

const Status = styled.div`
  background: black;
  opacity: 0.25;
  width: 95%;
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
  font-size: 0.9em;
`;

const TrainerInfo: React.FC<{ trainer: any; loading: any }> = ({
  trainer,
  loading,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(trainer?.active);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleEdit = () => {
    form.setFieldsValue({
      ...trainer.ucGetResponse,
      birthdate: moment(trainer.ucGetResponse.birthdate),
      active: trainer.active,
      endDate: trainer.passiveEndDate,
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values: any) => {
    const payload = {
      id: trainer.id,
      isActive: values.active, // Checkbox state for active status
      temporarilyPassive: !values.active && values.endDate ? true : false, // Set to true only if inactive and endDate exists
      /* passiveEndDate: values.active
        ? null
        : values.endDate?.format("YYYY-MM-DD"), // Null if active; otherwise, endDate */
      passiveEndDate: null,
      ucUpdateRequest: {
        birthdate: values.birthdate.format("YYYY-MM-DD"), // Birthdate in "YYYY-MM-DD" format
      },
    };

    trainerService
      .update(payload)
      .then(() => {
        message.success("Trainer updated successfully");
        window.location.reload();
        setIsEditModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error("Error updating trainer:", error);
        message.error("Failed to update trainer");
      });
  };

  useEffect(() => {
    setIsActive((prev: any) => !prev);
  }, []);

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the trainer.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        trainerService
          .delete(trainer.id)
          .then(() => {
            message.success("Trainer deleted successfully");
            navigate("/trainers");
          })
          .catch((error) => {
            console.error("Error deleting trainer:", error);
            message.error("Failed to delete trainer");
          });
      },
    });
  };

  const handleCheckboxChange = (e: any) => {
    setIsActive(e.target.checked); // Update active status
    if (e.target.checked) {
      form.setFieldsValue({ endDate: null }); // Reset end date if active
    }
  };

  if (loading) {
    return (
      <Container>
        <Spin size="large" style={{ margin: "auto" }} />
      </Container>
    );
  }

  if (!trainer) {
    return (
      <Container>
        <p style={{ textAlign: "center" }}>Trainer not found</p>
      </Container>
    );
  }

  /*  const whatsappLink = `https://wa.me/${trainer.phone.replace(/\s+/g, "")}`;

 */

  const whatsappLink = "https://wa.me/+905077845678";

  return (
    <>
      <Container>
        {/*  {!trainer.active && <Status>Not active</Status>} */}
        <ActionButtons>
          <EditButton onClick={handleEdit} type="primary">
            <EditFilled />
          </EditButton>
          <DeleteButton onClick={handleDelete} type="primary">
            <DeleteOutlined />
          </DeleteButton>
        </ActionButtons>

        <ProfileSection>
          <AvatarContainer>
            {!trainer.active && <InactiveIcon title="Not working" />}
            <Avatar
              size={150}
              src={trainer.avatarUrl || null}
              icon={<UserOutlined />}
              style={{ marginBottom: 8 }}
            />
          </AvatarContainer>
          <Name>
            {trainer.ucGetResponse.name} {trainer.ucGetResponse.surname}
          </Name>
          <Title>Pilates Eğitmeni</Title>
        </ProfileSection>

        <Link to={`/companies/${trainer.companyId}`}>
          <CompanyInfo>
            <CompanyLogo>
              <BsBuilding style={{ fontSize: 20 }} />
            </CompanyLogo>
            <CompanyName>
              <strong>{trainer.companyName}</strong>
              <small>{trainer.branchName}</small>
            </CompanyName>
            <CompanyDetailButton>
              <ArrowRightOutlined />
            </CompanyDetailButton>
          </CompanyInfo>
        </Link>

        <InfoSection>
          <InfoItem>
            <span>Email:</span> {trainer.email}
          </InfoItem>
          <InfoItem>
            <span>Phone:</span> {trainer.ucGetResponse.telNo1}
          </InfoItem>
          <InfoItem>
            <span>Birthdate:</span>{" "}
            {moment(trainer.ucGetResponse.birthdate).format("DD MMMM YYYY")}
          </InfoItem>
        </InfoSection>
        <ContactInfo>
          <a href={`mailto:${trainer.email}`} style={{ color: "#4a4a4a" }}>
            <ContactButton>
              <BsEnvelopeFill />
            </ContactButton>
          </a>
          <a href={`tel:${trainer.phone}`} style={{ color: "#4a4a4a" }}>
            <ContactButton>
              <PhoneFilled />
            </ContactButton>
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4a4a4a" }}
          >
            <ContactButton>
              <BsWhatsapp />
            </ContactButton>
          </a>
        </ContactInfo>

        <Modal
          title="Edit Trainer"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onOk={() => {
            form.validateFields().then(handleEditSubmit).catch(console.error);
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="surname"
              label="Surname"
              rules={[{ required: true, message: "Please enter the surname" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="birthdate"
              label="Birthdate"
              rules={[
                { required: true, message: "Please select the birthdate" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="telNo1"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter the phone number" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select the gender" }]}
            >
              <Select>
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="active"
              label="Is Active"
              valuePropName="checked"
              rules={[{ required: true, message: "Please select the status" }]}
            >
              <Checkbox onChange={handleCheckboxChange}>Is Active</Checkbox>
            </Form.Item>
            {!isActive && (
              <Form.Item name="endDate" label="End Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            )}
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default TrainerInfo;
