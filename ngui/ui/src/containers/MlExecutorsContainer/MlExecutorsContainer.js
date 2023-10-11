import React from "react";
import MlExecutorsTable from "components/MlExecutorsTable";
import MlExecutorsService from "services/MlExecutorsService";
import { inDateRange, secondsToMilliseconds } from "utils/datetime";

const Container = ({ getFilteredExecutors }) => {
  const { useGet } = MlExecutorsService();
  const { isLoading, executors } = useGet();

  return <MlExecutorsTable executors={getFilteredExecutors(executors)} isLoading={isLoading} />;
};

const MlExecutorsContainer = ({ dateRange }) => {
  const getFilteredExecutors = (executors) =>
    executors.filter(({ last_used: lastUsed }) => inDateRange(dateRange, secondsToMilliseconds(lastUsed)));

  return <Container getFilteredExecutors={getFilteredExecutors} />;
};

export default MlExecutorsContainer;
