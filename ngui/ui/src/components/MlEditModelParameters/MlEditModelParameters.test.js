import React from "react";
import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import MlEditModelParameters from "./MlEditModelParameters";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <MlEditModelParameters parameters={[]} onAttachChange={vi.fn} />
    </TestProvider>
  );
  root.unmount();
});
