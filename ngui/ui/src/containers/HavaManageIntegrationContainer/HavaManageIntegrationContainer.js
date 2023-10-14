import React from "react";
import HavaManageIntegration from "components/HavaManageIntegration";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";

const HavaManageIntegrationContainer = () => {
  const organization = useOrganizationInfo();

  const havaOrganizationData = {
    organization,
    havaIntegrated: false
  };

  return <HavaManageIntegration havaOrganizationData={havaOrganizationData} />;
};

export default HavaManageIntegrationContainer;
