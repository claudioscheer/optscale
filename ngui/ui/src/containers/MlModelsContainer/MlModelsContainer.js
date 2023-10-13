import React from "react";
import MlModels from "components/MlModels";
import MlModelsService from "services/MlModelsService";

const Container = () => {
  const { useGetAll } = MlModelsService();

  const { isLoading, models } = useGetAll();

  return <MlModels models={models} isLoading={isLoading} />;
};

const MlModelsContainer = () => <Container />;

export default MlModelsContainer;
