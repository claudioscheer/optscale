import React from "react";
import { GET_CURRENT_EMPLOYEE } from "api/restapi/actionTypes";
import Hava from "components/Integrations/Hava";
import { useApiData } from "hooks/useApiData";
import EmployeesService from "services/EmployeesService";
import SlackInstallationPathService from "services/SlackInstallationPathService";

const IntegrationsHavaContainer = () => {
  const { useGet: useGetSlackInstallationPath } = SlackInstallationPathService();
  const { useGet: useGetEmployees } = EmployeesService();

  const { isLoading: isGetEmployeesLoading, employees } = useGetEmployees();
  const { isLoading: isGetSlackInstallationPathLoading, url: slackInstallationPath } = useGetSlackInstallationPath();

  const { apiData: { currentEmployee: { slack_connected: isCurrentEmployeeConnectedToSlack = false } = {} } = {} } =
    useApiData(GET_CURRENT_EMPLOYEE);

  return (
    <Hava
      totalEmployees={employees.length}
      connectedEmployees={employees.filter((el) => el.slack_connected).length}
      isCurrentEmployeeConnectedToSlack={isCurrentEmployeeConnectedToSlack}
      slackInstallationPath={slackInstallationPath}
      isLoadingProps={{ isGetEmployeesLoading, isGetSlackInstallationPathLoading }}
    />
  );
};

export default IntegrationsHavaContainer;
