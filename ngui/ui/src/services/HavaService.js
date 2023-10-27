import { useDispatch } from "react-redux";
import { havaGetOrganization, havaUpdateIntegration, havaCreateIntegration } from "api";
import { HAVA_CREATE_INTEGRATION, HAVA_GET_ORGANIZATION, HAVA_UPDATE_INTEGRATION } from "api/restapi/actionTypes";
import { useApiState } from "hooks/useApiState";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import { useApiData } from "hooks/useApiData";
import { isError } from "utils/api";
import { useEffect } from "react";

const useGetHavaOrganization = () => {
  const dispatch = useDispatch();

  const { organizationId } = useOrganizationInfo();
  const { apiData } = useApiData(HAVA_GET_ORGANIZATION);

  const { isLoading, shouldInvoke } = useApiState(HAVA_GET_ORGANIZATION, {
    organizationId
  });

  useEffect(() => {
    if (shouldInvoke) {
      dispatch(havaGetOrganization(organizationId));
    }
  }, [dispatch, shouldInvoke, organizationId]);

  return { havaIntegration: apiData, organizationId, isLoading };
};

const useUpdateHavaIntegration = () => {
  const dispatch = useDispatch();

  const { organizationId } = useOrganizationInfo();
  const { isLoading } = useApiState(HAVA_UPDATE_INTEGRATION);

  const onUpdate = (params) =>
    new Promise((resolve, reject) => {
      dispatch((_, getState) => {
        dispatch(havaUpdateIntegration(organizationId, params)).then(() => {
          if (!isError(HAVA_UPDATE_INTEGRATION, getState())) {
            return resolve();
          }
          return reject();
        });
      });
    });

  return { onUpdate, isLoading };
};

const useCreateHavaIntegration = () => {
  const dispatch = useDispatch();

  const { organizationId } = useOrganizationInfo();
  const { isLoading } = useApiState(HAVA_CREATE_INTEGRATION);

  const onCreate = (params) =>
    new Promise((resolve, reject) => {
      dispatch((_, getState) => {
        dispatch(
          havaCreateIntegration({
            organization_id: organizationId,
            ...params
          })
        ).then(() => {
          if (!isError(HAVA_CREATE_INTEGRATION, getState())) {
            return resolve();
          }
          return reject();
        });
      });
    });

  return { onCreate, isLoading };
};

function HavaService() {
  return { useGetHavaOrganization, useUpdateHavaIntegration, useCreateHavaIntegration };
}

export default HavaService;
