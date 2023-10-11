import React from "react";
import MlModelGlobalParameters from "components/MlModelGlobalParameters";
import MlModelsService from "services/MlModelsService";

const Container = () => {
  const { useGetGlobalParameters } = MlModelsService();

  const { isLoading, parameters } = useGetGlobalParameters();

  return <MlModelGlobalParameters parameters={parameters} isLoading={isLoading} />;
};

const MlModelGlobalParametersContainer = () => <Container />;

export default MlModelGlobalParametersContainer;
