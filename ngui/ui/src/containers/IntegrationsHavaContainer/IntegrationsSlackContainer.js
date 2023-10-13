import React from "react";
import Hava from "components/Integrations/Hava";
import EmployeesService from "services/EmployeesService";

const IntegrationsHavaContainer = () => {
  const { useGet: useGetEmployees } = EmployeesService();

  // TODO: use getOrganizationConnectedToHava instead of getEmployees
  const { isLoading: isGetEmployeesLoading } = useGetEmployees();

  return (
    <Hava
      isOrganizationConnectedToHava={false}
      isLoadingProps={{ isGetOrganizationConnectedLoading: isGetEmployeesLoading }}
    />
  );
};

export default IntegrationsHavaContainer;
