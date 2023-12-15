import { useParams } from "react-router-dom";
import ConnectSlackContainer from "containers/ConnectSlackContainer";

const ConnectSlack = () => {
  const { secret } = useParams();

  return <ConnectSlackContainer secret={secret} />;
};

export default ConnectSlack;
