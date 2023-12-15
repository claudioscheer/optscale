import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import ClusterTypes from "./ClusterTypes";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <ClusterTypes clusterTypes={[]} />
    </TestProvider>
  );
  root.unmount();
});
