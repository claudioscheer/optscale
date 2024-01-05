import React from "react";
import HavaManageIntegration from "components/HavaManageIntegration";
import HavaService from "services/HavaService";
import { useNavigate } from "react-router-dom";
import { INTEGRATIONS } from "urls";

const HavaManageIntegrationContainer = () => {
  const navigate = useNavigate();
  const { useGetHavaOrganization, useCreateHavaIntegration, useUpdateHavaIntegration } = HavaService();

  const { havaIntegration, isLoading, organizationId } = useGetHavaOrganization();
  const { onUpdate, isLoading: isLoadingUpdate } = useUpdateHavaIntegration();
  const { onCreate, isLoading: isLoadingCreate } = useCreateHavaIntegration();
  const editMode = !!havaIntegration.organization_id;

  const onSubmit = (formData) => {
    const body = {
      enabled: !!formData.enabled,
      hava_api_key: formData.havaApiKey
    };

    const func = editMode ? onUpdate : onCreate;
    func(body).then(() => {
      navigate(INTEGRATIONS);
    });
  };

  return (
    <HavaManageIntegration
      isLoading={isLoading || isLoadingUpdate || isLoadingCreate}
      organizationId={organizationId}
      havaOrganization={havaIntegration}
      editMode={editMode}
      onSubmit={onSubmit}
    />
  );
};

export default HavaManageIntegrationContainer;
