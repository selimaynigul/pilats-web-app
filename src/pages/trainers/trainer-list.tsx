import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Row, Col, Spin } from "antd";
import TrainerCard from "./trainer-card";
import apiClient from "api/config";

const TrainerListContainer = styled.div``;

const trainersData = Array(50)
  .fill("")
  .map((_, i) => ({
    name: `Trainer ${i + 1}`,
    title: "Title",
    department: "Department",
    hiredDate: "Date",
    email: `trainer${i + 1}@example.com`,
    phone: `123-456-789${i}`,
    avatarUrl: `https://i.pravatar.cc/150?img=${i % 10}`,
  }));

const TrainerList: React.FC = () => {
  /*  const [trainers, setTrainers] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const fetchTrainers = async (page: any) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/users` {
        params: { page, limit: 8 },
      } 
      );
      const data = response.data;

      setTrainers((prevTrainers: any) => [...prevTrainers, ...data]);
      setHasMore(data.hasMore); // API should return a flag indicating if there are more items
    } catch (error) {
      console.error("Error fetching trainers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers(page);
  }, [page]);

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

  const [trainers, setTrainers] = useState(trainersData.slice(0, 8)); // Initial 6 items
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const loadMore = () => {
    console.log("load");
    setLoading(true);
    setTimeout(() => {
      const currentLength = trainers.length;
      const newTrainers = trainersData.slice(currentLength, currentLength + 8);
      setTrainers((prevTrainers) => [...prevTrainers, ...newTrainers]);
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [loading]);
  return (
    /*   <TrainerListContainer>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer: any, index: any) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <TrainerCard trainer={trainer} />
          </Col>
        ))}
      </Row>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
      <div ref={observerRef} style={{ height: "20px" }} />{" "}
     
    </TrainerListContainer> */
    <TrainerListContainer>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <TrainerCard trainer={trainer} />
          </Col>
        ))}
      </Row>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
      <div ref={observerRef} style={{ height: "20px" }} />{" "}
      {/* Trigger element */}
    </TrainerListContainer>
  );
};

export default TrainerList;
