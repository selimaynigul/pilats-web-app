import React, { useEffect, useState, useRef } from "react";
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
  UploadOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  imageService,
  jobService,
  trainerService,
  userService,
} from "services";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { capitalize } from "utils/permissionUtils";
import { Helmet } from "react-helmet";

const countryCodes = [
  { code: "+90", country: "TR" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "GR" },
  { code: "+33", country: "FR" },
  // if need add more no necc mens1s
];

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;

  .upload-icon {
    color: white;
    font-size: 24px;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${UploadOverlay} {
    opacity: 1;
  }
`;
const Container = styled.div`
  background: ${({ theme }) => theme.cardBg};
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
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};

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

const AvatarContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: auto;
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

const UserInfo: React.FC<{ user: any; loading: any }> = ({ user, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [jobLoading, setJobLoading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(user?.active);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleEdit = () => {
    form.setFieldsValue({
      ...user.ucGetResponse,
      birthdate: moment(user.ucGetResponse.birthdate),
      active: user.active,
      endDate: user.passiveEndDate,
      jobId: user.jobName,
      location: user.location,
    });
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    if (isEditModalVisible) {
      fetchJobs();
    }
  }, [isEditModalVisible]);

  const fetchJobs = async () => {
    setJobLoading(true);
    try {
      const response = await jobService.getAll();
      setJobs(response.data);
    } catch (error) {
      message.error("Failed to fetch jobs");
    } finally {
      setJobLoading(false);
    }
  };

  const handleAddNewJob = async () => {
    try {
      if (!newJobName) return message.error("Please enter a job name");
      if (!newJobDesc) return message.error("Please enter a job name");
      await jobService.add({
        jobName: newJobName,
        jobDesc: "Designs, develops, tests and deploys software products.",
      });
      message.success("Job added successfully");
      setIsAddingJob(false);
      setNewJobName("");
      setNewJobDesc("");
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      message.error("Failed to add job");
    }
  };

  const handleEditSubmit = (values: any) => {
    const formattedPhone = `${values.countryCode}${values.phoneNumber}`;

    const payload = {
      id: user.id,
      temporarilyPassive: !values.active && values.endDate ? true : false,
      passiveEndDate: null,
      ucUpdateRequest: {
        name: values.name,
        surname: values.surname,
        birthdate: values.birthdate.format("YYYY-MM-DD"),
        gender: values.gender.toUpperCase(),
        telNo1: formattedPhone,
      },
      jobId: jobs.find((job) => job.jobName === values.jobId)?.id,
      location: values.location,
    };

    userService
      .update(payload)
      .then(() => {
        message.success("User updated successfully");
        window.location.reload();
        setIsEditModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        message.error("Failed to update user. " + error);
      });
  };

  useEffect(() => {
    if (user) {
      var phoneNumber = user.ucGetResponse.telNo1 || "";
      // Extract country code and number from phone number
      for (const code of countryCodes) {
        if (phoneNumber.startsWith(code.code)) {
          phoneNumber = phoneNumber.replace(code.code, "");
          form.setFieldsValue({ countryCode: code.code });
          form.setFieldsValue({ phoneNumber: phoneNumber });
          break;
        }
      }
      form.setFieldsValue({
        ...user.ucGetResponse,
        birthdate: moment(user.ucGetResponse.birthdate),
        active: user.active,
        endDate: user.passiveEndDate,
        jobId: user.jobName,
        location: user.location,
      });
    }
  }, [user, form]);

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the user.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        userService
          .delete(user.id)
          .then(() => {
            message.success("User deleted successfully");
            navigate("/users");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user");
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

  if (!user) {
    return (
      <Container>
        <p style={{ textAlign: "center" }}>User not found</p>
      </Container>
    );
  }

  /*  const whatsappLink = `https://wa.me/${trainer.phone.replace(/\s+/g, "")}`;

 */

  const whatsappLink = "https://wa.me/+905077845678";
  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // File input'u tıklanmış gibi tetikle
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirm = window.confirm("Do you want to upload this image?");
    if (!confirm) return;

    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("type", file.type);
    formData.append("data", file);
    formData.append("id", user.id);

    await imageService.postCustomerImage(formData);
    navigate("/users");
  };
  return (
    <>
      <Helmet>
        <title>
          Pilats - {user.ucGetResponse.name} {user.ucGetResponse.surname}
        </title>
      </Helmet>
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
          <AvatarContainer onClick={handleAvatarClick}>
            <AvatarWrapper>
              <Avatar
                size={150}
                src={
                  "https://prod-grad.onrender.com/api/v1/images" + user.imageUrl
                }
                icon={<UserOutlined />}
              />
              <UploadOverlay>
                <UploadOutlined className="upload-icon" />
              </UploadOverlay>
            </AvatarWrapper>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".png"
              onChange={handleFileChange}
            />
          </AvatarContainer>
          <Name>
            {capitalize(`${user.ucGetResponse.name} `)}
            {capitalize(`${user.ucGetResponse.surname}`)}
          </Name>
          <Title>{user.jobName}</Title>
        </ProfileSection>

        <InfoSection>
          <InfoItem>
            <span>Email:</span> {user.email}
          </InfoItem>
          <InfoItem>
            <span>Phone:</span> {user.ucGetResponse.telNo1}
          </InfoItem>
          <InfoItem>
            <span>Birthdate:</span>{" "}
            {moment(user.ucGetResponse.birthdate).format("DD MMMM YYYY")}
          </InfoItem>
          <InfoItem>
            <span>Location:</span>{" "}
            {user.location ? user.location : "Not specified"}
          </InfoItem>
        </InfoSection>
        <ContactInfo>
          <a href={`mailto:${user.email}`} style={{ color: "#4a4a4a" }}>
            <ContactButton>
              <BsEnvelopeFill />
            </ContactButton>
          </a>
          <a href={`tel:${user.phone}`} style={{ color: "#4a4a4a" }}>
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
          title="Edit User"
          open={isEditModalVisible}
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
            <Form.Item label="Phone Number" required>
              <Input.Group compact>
                <Form.Item
                  name="countryCode"
                  noStyle
                  initialValue="+90"
                  rules={[
                    {
                      required: true,
                      message: "Please select a country code!",
                    },
                  ]}
                >
                  <Select style={{ width: "30%" }}>
                    {countryCodes.map(({ code, country }) => (
                      <Select.Option key={code} value={code}>
                        {`${code} ${country}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                    {
                      pattern: /^\d{10}$/,
                      message: "Please enter a valid 10-digit phone number!",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "70%" }}
                    prefix={<PhoneOutlined />}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ phoneNumber: value });
                    }}
                  />
                </Form.Item>
              </Input.Group>
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
              name="jobId"
              label="Job"
              rules={[
                { required: false, message: "Please select or add a job" },
              ]}
            >
              {isAddingJob ? (
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 90px)" }}
                    value={newJobName}
                    onChange={(e) => setNewJobName(e.target.value)}
                    placeholder="Enter new job name"
                  />
                  <Input
                    style={{
                      width: "calc(100% - 90px)",
                      marginTop: "7px",
                      marginBottom: "7px",
                    }}
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                    placeholder="Enter new job description"
                  />
                  <br />
                  <Button
                    type="primary"
                    onClick={handleAddNewJob}
                    loading={jobLoading}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => setIsAddingJob(false)}
                    style={{ marginLeft: "8px" }}
                  >
                    Cancel
                  </Button>
                </Input.Group>
              ) : (
                <Select
                  loading={jobLoading}
                  placeholder="Select job"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddingJob(true)}
                        style={{ paddingLeft: 8 }}
                      >
                        Add new job
                      </Button>
                    </>
                  )}
                >
                  {jobs.map((job) => (
                    <Select.Option key={job.id} value={job.jobName}>
                      {job.jobName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[
                { required: false, message: "Please enter the location" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default UserInfo;
