import React from "react";
import MlRunsetTemplatesTable from "components/MlRunsetTemplatesTable";
import MlRunsetTemplatesService from "services/MlRunsetTemplatesService";

const Container = () => {
  const { useGetAll } = MlRunsetTemplatesService();

  const { isLoading, runsetTemplates } = useGetAll();

  return <MlRunsetTemplatesTable data={runsetTemplates} isLoading={isLoading} />;
};

const MlRunsetTemplatesContainer = () => <Container />;

export default MlRunsetTemplatesContainer;
