import { useParams } from "react-router-dom";
import ConnectJiraContainer from "containers/ConnectJiraContainer";

const ConnectJira = () => {
  const { secret } = useParams();

  return <ConnectJiraContainer secret={secret} />;
};

export default ConnectJira;
