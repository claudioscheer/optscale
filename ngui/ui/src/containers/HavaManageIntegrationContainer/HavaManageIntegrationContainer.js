import React, { useEffect } from "react";
import HavaManageIntegration from "components/HavaManageIntegration";
import HavaService from "services/HavaService";

const HavaManageIntegrationContainer = () => {
  const { useGetHavaOrganization } = HavaService();

  const { getHavaOrganizations, isLoading } = useGetHavaOrganization();

  useEffect(() => {
    getHavaOrganizations();
  }, []);

  const havaOrganizationData = {
    havaIntegrated: false
  };

  return <HavaManageIntegration havaOrganizationData={havaOrganizationData} />;
};

export default HavaManageIntegrationContainer;
