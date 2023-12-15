import { HAVA_MANAGE_INTEGRATION } from "urls";
import BaseRoute from "./baseRoute";

class HavaManageIntegrationRoute extends BaseRoute {
  page = "HavaManageIntegration";

  link = HAVA_MANAGE_INTEGRATION;
}

export default new HavaManageIntegrationRoute();
