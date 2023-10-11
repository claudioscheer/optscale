import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import MlEditModelParameters from "components/MlEditModelParameters";
import MlModelsService from "services/MlModelsService";

const Container = ({ getParameters }) => {
  const { modelId } = useParams();
  const { useUpdateModel, useGetGlobalParameters } = MlModelsService();

  const { isLoading: isGetGlobalParametersLoading, parameters: globalParameters } = useGetGlobalParameters();
  const { onUpdate, isLoading: isUpdateLoading } = useUpdateModel();

  const onAttachChange = (formData) => {
    onUpdate(modelId, formData);
  };

  return (
    <MlEditModelParameters
      parameters={getParameters(globalParameters)}
      onAttachChange={onAttachChange}
      isLoading={isGetGlobalParametersLoading}
      isUpdateLoading={isUpdateLoading}
    />
  );
};

const MlEditModelParametersContainer = ({ modelParameters }) => {
  const getParameters = (globalParameters) => {
    const parameters = globalParameters.map((globalParameter) => {
      const isAttached = !!modelParameters.find((modelParameter) => modelParameter.key === globalParameter.key);

      return {
        is_attached: isAttached,
        ...globalParameter
      };
    });

    return parameters;
  };

  return <Container getParameters={getParameters} />;
};

MlEditModelParametersContainer.propTypes = {
  modelParameters: PropTypes.array.isRequired
};

export default MlEditModelParametersContainer;
