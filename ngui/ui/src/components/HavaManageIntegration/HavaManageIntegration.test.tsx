import React from "react";
import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import HavaManageIntegration from "./HavaManageIntegration";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <HavaManageIntegration
        havaOrganizationData={{
          organization: {},
          havaIntegrated: false
        }}
      />
    </TestProvider>
  );
  root.unmount();
});
