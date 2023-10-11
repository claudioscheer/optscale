import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import MlExecutorsTable from "components/MlExecutorsTable";
import MlExecutorsService from "services/MlExecutorsService";

const Container = () => {
  const { runId } = useParams();

  const { useGet } = MlExecutorsService();

  const runIds = useMemo(() => [runId], [runId]);

  const { isLoading, executors } = useGet({ runIds });

  return <MlExecutorsTable executors={executors} isLoading={isLoading} />;
};

const Executors = () => <Container />;

export default Executors;
