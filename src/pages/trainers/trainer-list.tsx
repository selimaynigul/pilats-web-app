import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Row, Col, Spin, message } from "antd";
import TrainerCard from "./trainer-card";
import apiClient from "config/api-client";
import { Link } from "react-router-dom";
import { trainerService } from "services";

const TrainerListContainer = styled.div``;

const TrainerList: React.FC = () => {
  const [trainers, setTrainers] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const fetchTrainers = (page: any) => {
    setLoading(true);

    const trainerSearchRequest = {
      ucSearchRequest: {
        id: null, // Or any other filters
        name: "John",
        surname: "Doe",
        birthdate: "1990-01-01",
        gender: "MALE", // Enum value
        telNo1: "123456789",
        birthdateStart: "1980-01-01",
        birthdateEnd: "2000-01-01",
      },
      id: null,
      branchId: 3,
      companyId: 4,
      searchByPageDto: {
        pageNumber: 1,
        pageSize: 10,
        sortField: "name",
        sortDirection: "ASC", // Sorting direction: "ASC" or "DESC"
      },
    };
    trainerService
      .search({
        searchByPageDto: {
          sort: "DESC",
        },
      })
      .then((res) => {
        console.log(res.data);
        setTrainers(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error("trainers getall failed");
      });
  };

  useEffect(() => {
    fetchTrainers(page);
  }, [page]);
  /* 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.disconnect();
    };
  }, [loading, hasMore]); */

  return (
    <TrainerListContainer>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer: any, index: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Link to={`/trainers/${trainer.id}`}>
              <TrainerCard trainer={trainer} />
            </Link>
          </Col>
        ))}
      </Row>
      {/*   {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
      <div ref={observerRef} style={{ height: "20px" }} />{" "} */}
    </TrainerListContainer>
  );
};

export default TrainerList;
