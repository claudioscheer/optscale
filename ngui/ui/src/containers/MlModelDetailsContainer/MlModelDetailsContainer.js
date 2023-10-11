import React from "react";
import { useParams } from "react-router-dom";
import MlModelDetails from "components/MlModelDetails";
import MlModelsService from "services/MlModelsService";

const Container = () => {
  const { modelId } = useParams();

  const { useGetOne } = MlModelsService();

  const { model, isLoading } = useGetOne(modelId);

  return <MlModelDetails isLoading={isLoading} model={model} />;
};

const MlModelDetailsContainer = () => <Container />;

export default MlModelDetailsContainer;
