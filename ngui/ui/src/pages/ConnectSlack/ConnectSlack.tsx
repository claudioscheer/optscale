<<<<<<< HEAD:ngui/ui/src/pages/ConnectSlack/ConnectSlack.js
import React from "react";
=======
import { useEffect } from "react";
>>>>>>> integration:ngui/ui/src/pages/ConnectSlack/ConnectSlack.tsx
import { useParams } from "react-router-dom";
import ConnectSlackContainer from "containers/ConnectSlackContainer";

const ConnectSlack = () => {
  const { secret } = useParams();

  return <ConnectSlackContainer secret={secret} />;
};

export default ConnectSlack;
