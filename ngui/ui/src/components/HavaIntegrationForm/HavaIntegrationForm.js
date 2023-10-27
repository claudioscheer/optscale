import React from "react";
import PropTypes from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import { HavaApiKeyInput, HavaIntegrationFormButtons, HavaIntegrationEnabledCheckbox } from "./FormElements";

const NAME_FIELD_API_KEY = "havaApiKey";

const HavaIntegrationForm = ({ onSubmit, isLoading = false }) => {
  const methods = useForm({
    defaultValues: {
      [NAME_FIELD_API_KEY]: ""
    }
  });

  const { handleSubmit } = methods;

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

HavaIntegrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default HavaIntegrationForm;
