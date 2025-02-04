import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import TagKey from "./TagKey";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <TagKey tagKey="key" />
    </TestProvider>
  );
  root.unmount();
});
