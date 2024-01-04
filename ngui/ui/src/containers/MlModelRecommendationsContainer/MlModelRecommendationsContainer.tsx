import { useParams } from "react-router-dom";
import MlModelRecommendations from "components/MlModelRecommendations";
import MlModelsService from "services/MlModelsService";

const Container = () => {
  const { taskId } = useParams();

  const { useGetModelRecommendations } = MlModelsService();
  const { isLoading: isGetRecommendationsLoading, recommendations } = useGetModelRecommendations(taskId);
  return <MlModelRecommendations taskId={taskId} isLoading={isGetRecommendationsLoading} recommendations={recommendations} />;
};

const MlModelRecommendationsContainer = () =>  <Container />;

export default MlModelRecommendationsContainer;
