import React from "react";
import { useParams } from "react-router-dom";
import Executors from "components/MlRunsetOverview/Components/Tabs/Executors";
import MlRunsetsService from "services/MlRunsetsService";

const Container = () => {
  const { runsetId } = useParams();

  const { useGetRunners } = MlRunsetsService();

  const { isLoading, executors } = useGetRunners(runsetId);

  return <Executors isLoading={isLoading} executors={executors} />;
};

const MlRunsetExecutorsContainer = () => <Container />;

export default MlRunsetExecutorsContainer;
