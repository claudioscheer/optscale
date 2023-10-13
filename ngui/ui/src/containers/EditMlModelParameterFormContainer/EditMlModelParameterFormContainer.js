import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MlModelParameterForm, { ML_MODEL_PARAMETER_FORM_FIELD_NAMES } from "components/MlModelParameterForm";
import MlModelsService from "services/MlModelsService";
import { ML_MODELS_PARAMETERS } from "urls";

const Container = () => {
  const navigate = useNavigate();

  const { parameterId } = useParams();

  const { useAlwaysGetGlobalParameter, useUpdateGlobalParameter } = MlModelsService();

  const { isLoading: isGetGlobalParameterLoading, parameter } = useAlwaysGetGlobalParameter(parameterId);

  const { onUpdate, isLoading: isUpdateGlobalParameterLoading } = useUpdateGlobalParameter(parameterId);

  const redirect = () => navigate(ML_MODELS_PARAMETERS);

  const onSubmit = (formData) => {
    onUpdate(formData).then(() => {
      redirect();
    });
  };

  const onCancel = () => redirect();

  const defaultValues = useMemo(
    () => ({
      [ML_MODEL_PARAMETER_FORM_FIELD_NAMES.NAME]: parameter.name ?? "",
      [ML_MODEL_PARAMETER_FORM_FIELD_NAMES.TENDENCY]: parameter.tendency ?? "",
      [ML_MODEL_PARAMETER_FORM_FIELD_NAMES.TARGET_VALUE]: parameter.target_value ?? "",
      [ML_MODEL_PARAMETER_FORM_FIELD_NAMES.FUNCTION]: parameter.func ?? ""
    }),
    [parameter.name, parameter.func, parameter.target_value, parameter.tendency]
  );

  return (
    <MlModelParameterForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isGetLoading={isGetGlobalParameterLoading}
      isSubmitLoading={isUpdateGlobalParameterLoading}
      isEdit
    />
  );
};

const EditMlModelParameterFormContainer = () => <Container />;

export default EditMlModelParameterFormContainer;
