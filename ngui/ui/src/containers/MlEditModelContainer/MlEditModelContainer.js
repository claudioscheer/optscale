import React from "react";
import { useParams } from "react-router-dom";
import MlEditModel from "components/MlEditModel";
import MlModelsService from "services/MlModelsService";

const Container = () => {
  const { modelId } = useParams();

  const { useGetOne } = MlModelsService();
  const { model, isLoading } = useGetOne(modelId);

  return <MlEditModel isLoading={isLoading} model={model} />;
};

const MlEditModelContainer = () => <Container />;

export default MlEditModelContainer;
