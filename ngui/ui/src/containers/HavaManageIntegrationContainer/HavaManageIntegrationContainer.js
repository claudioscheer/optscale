import React from "react";
import HavaManageIntegration from "components/HavaManageIntegration";
import HavaService from "services/HavaService";

const HavaManageIntegrationContainer = () => {
  const { useGetHavaOrganization, useCreateHavaIntegration, useUpdateHavaIntegration } = HavaService();

  const { havaIntegration, getHavaIntegration, isLoading, organizationId } = useGetHavaOrganization();
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
      getHavaIntegration();
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
