import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import TrainerCard from "./trainer-card";

const TrainerListContainer = styled.div``;

const trainersData = [
  {
    name: "Bessie Cooper",
    title: "Project Manager",
    department: "Design Team",
    hiredDate: "7/27/13",
    email: "Ronald043@gmail.com",
    phone: "(229) 555-0109",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "John Doe",
    title: "Lead Developer",
    department: "Tech Team",
    hiredDate: "5/13/14",
    email: "john.doe@example.com",
    phone: "(229) 555-1234",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Alice Smith",
    title: "HR Manager",
    department: "HR Team",
    hiredDate: "3/17/15",
    email: "alice.smith@example.com",
    phone: "(229) 555-5678",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Jane Doe",
    title: "Marketing Lead",
    department: "Marketing",
    hiredDate: "9/25/16",
    email: "jane.doe@example.com",
    phone: "(229) 555-8765",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Bob Johnson",
    title: "Data Analyst",
    department: "Data Team",
    hiredDate: "11/12/17",
    email: "bob.johnson@example.com",
    phone: "(229) 555-4321",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Emily Davis",
    title: "UI/UX Designer",
    department: "Design Team",
    hiredDate: "4/29/18",
    email: "emily.davis@example.com",
    phone: "(229) 555-9876",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Jane Doe",
    title: "Marketing Lead",
    department: "Marketing",
    hiredDate: "9/25/16",
    email: "jane.doe@example.com",
    phone: "(229) 555-8765",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Bob Johnson",
    title: "Data Analyst",
    department: "Data Team",
    hiredDate: "11/12/17",
    email: "bob.johnson@example.com",
    phone: "(229) 555-4321",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Emily Davis",
    title: "UI/UX Designer",
    department: "Design Team",
    hiredDate: "4/29/18",
    email: "emily.davis@example.com",
    phone: "(229) 555-9876",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Jane Doe",
    title: "Marketing Lead",
    department: "Marketing",
    hiredDate: "9/25/16",
    email: "jane.doe@example.com",
    phone: "(229) 555-8765",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Bob Johnson",
    title: "Data Analyst",
    department: "Data Team",
    hiredDate: "11/12/17",
    email: "bob.johnson@example.com",
    phone: "(229) 555-4321",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Emily Davis",
    title: "UI/UX Designer",
    department: "Design Team",
    hiredDate: "4/29/18",
    email: "emily.davis@example.com",
    phone: "(229) 555-9876",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Jane Doe",
    title: "Marketing Lead",
    department: "Marketing",
    hiredDate: "9/25/16",
    email: "jane.doe@example.com",
    phone: "(229) 555-8765",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Bob Johnson",
    title: "Data Analyst",
    department: "Data Team",
    hiredDate: "11/12/17",
    email: "bob.johnson@example.com",
    phone: "(229) 555-4321",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Emily Davis",
    title: "UI/UX Designer",
    department: "Design Team",
    hiredDate: "4/29/18",
    email: "emily.davis@example.com",
    phone: "(229) 555-9876",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Jane Doe",
    title: "Marketing Lead",
    department: "Marketing",
    hiredDate: "9/25/16",
    email: "jane.doe@example.com",
    phone: "(229) 555-8765",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Bob Johnson",
    title: "Data Analyst",
    department: "Data Team",
    hiredDate: "11/12/17",
    email: "bob.johnson@example.com",
    phone: "(229) 555-4321",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Emily Davis",
    title: "UI/UX Designer",
    department: "Design Team",
    hiredDate: "4/29/18",
    email: "emily.davis@example.com",
    phone: "(229) 555-9876",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
];

const TrainerList: React.FC = () => {
  return (
    <TrainerListContainer>
      <Row gutter={[16, 16]}>
        {trainersData.map((trainer, index) => (
          <Col
            xs={24} // 1 column on extra small screens
            sm={12} // 2 columns on small screens
            md={12} // 3 columns on medium and larger screens
            lg={6} // 3 columns on medium and larger screens
            key={index}
          >
            <TrainerCard trainer={trainer} />
          </Col>
        ))}
      </Row>
    </TrainerListContainer>
  );
};

export default TrainerList;
