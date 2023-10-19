import React from "react";
import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import MlModelCreateForm from "./MlModelCreateForm";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <MlModelCreateForm onSubmit={vi.fn} onCancel={vi.fn} />
    </TestProvider>
  );
  root.unmount();
});
