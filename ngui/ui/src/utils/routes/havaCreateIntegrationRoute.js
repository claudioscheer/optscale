import { HAVA_CREATE_INTEGRATION } from "urls";
import BaseRoute from "./baseRoute";

class HavaCreateIntegrationRoute extends BaseRoute {
  page = "HavaCreateIntegration";

  link = HAVA_CREATE_INTEGRATION;
}

export default new HavaCreateIntegrationRoute();
