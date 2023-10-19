import { useDispatch } from "react-redux";
import { havaGetOrganization } from "api";
import { HAVA_GET_ORGANIZATION } from "api/restapi/actionTypes";
import { useApiState } from "hooks/useApiState";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import { checkError } from "utils/api";

const useGetHavaOrganization = () => {
  const dispatch = useDispatch();

  console.log("useGetHavaOrganization");

  const { isLoading } = useApiState(HAVA_GET_ORGANIZATION);
  const { organizationId } = useOrganizationInfo();

  const getHavaOrganizations = () =>
    new Promise((resolve, reject) => {
      dispatch((_, getState) => {
        dispatch(havaGetOrganization(organizationId))
          .then(() => checkError(HAVA_GET_ORGANIZATION, getState()))
          .then(() => resolve())
          .catch(() => reject());
      });
    });

  return { getHavaOrganizations, isLoading };
};

function HavaService() {
  return { useGetHavaOrganization };
}

export default HavaService;
