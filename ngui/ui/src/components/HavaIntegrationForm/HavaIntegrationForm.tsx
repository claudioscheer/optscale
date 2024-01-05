import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HavaApiKeyInput, HavaIntegrationFormButtons, HavaIntegrationEnabledCheckbox } from "./FormElements";
import { HAVA_INTEGRATION_ENABLED_FIELD_NAME } from "./FormElements/HavaIntegrationEnabled";

const NAME_FIELD_API_KEY = "havaApiKey";

const HavaIntegrationForm = ({ havaOrganization, onSubmit, isLoading = false }) => {
  const methods = useForm();

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset({
      [NAME_FIELD_API_KEY]: havaOrganization?.hava_api_key,
      [HAVA_INTEGRATION_ENABLED_FIELD_NAME]: !!havaOrganization?.enabled
    });
  }, [havaOrganization, reset]);

  return (
    <FormProvider {...methods}>
      <form data-test-id="create_model_form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <HavaApiKeyInput name={NAME_FIELD_API_KEY} />
        <HavaIntegrationEnabledCheckbox isLoading={isLoading} />
        <HavaIntegrationFormButtons isLoading={isLoading} />
      </form>
    </FormProvider>
  );
};

export default HavaIntegrationForm;
