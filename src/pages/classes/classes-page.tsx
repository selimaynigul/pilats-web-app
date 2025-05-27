import React, { useState } from "react";
import Scheduler from "../../components/scheduler/Scheduler";
import { Helmet } from "react-helmet";
import { useLanguage } from "hooks";
import styled from "styled-components";

const Container = styled.div`
/*   overflow: hidden;
 */
background: red;

`

const ClassesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Pilats - {t.sessions}</title>
      </Helmet>
      <Scheduler />
    </>
  );
};
export default ClassesPage;
