import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import GenerateLiveDemo from "./GenerateLiveDemo";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <GenerateLiveDemo isLoading />
    </TestProvider>
  );
  root.unmount();
});
