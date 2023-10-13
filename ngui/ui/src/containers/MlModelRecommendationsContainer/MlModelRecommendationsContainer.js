import React from "react";
import { useParams } from "react-router-dom";
import ModelDetailsSummary from "components/MlModelDetails/ModelDetailsSummary";
import MlModelsService from "services/MlModelsService";

const Container = ({ model, isModelDetailsLoading }) => {
  const { modelId } = useParams();

  const { useGetModelRecommendations } = MlModelsService();

  const { isLoading: isGetRecommendationsLoading, recommendations } = useGetModelRecommendations(modelId);

  return (
    <ModelDetailsSummary
      model={model}
      recommendations={recommendations}
      isModelDetailsLoading={isModelDetailsLoading}
      isGetRecommendationsLoading={isGetRecommendationsLoading}
    />
  );
};

const MlModelRecommendationsContainer = ({ model, isModelDetailsLoading }) => (
  <Container model={model} isModelDetailsLoading={isModelDetailsLoading} />
);

export default MlModelRecommendationsContainer;
