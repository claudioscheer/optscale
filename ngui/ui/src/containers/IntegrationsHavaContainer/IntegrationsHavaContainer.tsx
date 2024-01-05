import React from "react";
import Hava from "components/Integrations/Hava";
import HavaService from "services/HavaService";

const IntegrationsHavaContainer = () => {
  const { useGetHavaOrganization } = HavaService();

  const { havaIntegration, isLoading } = useGetHavaOrganization();
  const enabled = havaIntegration?.enabled || false;

  return <Hava isOrganizationConnectedToHava={enabled} isLoadingProps={{ isGetOrganizationConnectedLoading: isLoading }} />;
};

export default IntegrationsHavaContainer;
