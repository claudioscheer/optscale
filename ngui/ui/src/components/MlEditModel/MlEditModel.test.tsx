import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import MlEditModel from "./MlEditModel";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <MlEditModel model={{}} />
    </TestProvider>
  );
  root.unmount();
});
