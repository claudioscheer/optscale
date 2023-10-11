import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import MlExecutorsTable from "components/MlExecutorsTable";
import MlExecutorsService from "services/MlExecutorsService";

const Container = () => {
  const { modelId } = useParams();

  const { useGet } = MlExecutorsService();

  const modelIds = useMemo(() => [modelId], [modelId]);

  const { isLoading, executors = [] } = useGet({ modelIds });

  return <MlExecutorsTable isLoading={isLoading} executors={executors} />;
};

const MlModelExecutorsContainer = () => <Container />;

export default MlModelExecutorsContainer;
