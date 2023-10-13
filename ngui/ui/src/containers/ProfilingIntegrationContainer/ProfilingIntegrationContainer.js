import React from "react";
import ProfilingIntegration from "components/ProfilingIntegration/ProfilingIntegration";
import MlProfilingService from "services/MlProfilingService";

const Container = ({ modelKey }) => {
  const { useGetToken } = MlProfilingService();

  const { isLoading, token } = useGetToken();

  return <ProfilingIntegration isLoading={isLoading} modelKey={modelKey} profilingToken={token} />;
};

const ProfilingIntegrationContainer = ({ modelKey }) => <Container modelKey={modelKey} />;

export default ProfilingIntegrationContainer;
