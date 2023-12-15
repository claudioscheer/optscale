import { useCallback, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { render as renderGithubButton } from "github-buttons";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { GET_DATA_SOURCES } from "api/restapi/actionTypes";
import { useApiData } from "hooks/useApiData";
import { useApiState } from "hooks/useApiState";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import { AZURE_TENANT, ENVIRONMENT } from "utils/constants";
import { updateOrganizationTopAlert as updateOrganizationTopAlertActionCreator } from "./actionCreators";
import { useAllAlertsSelector } from "./selectors";
import TopAlert from "./TopAlert";

export const ALERT_TYPES = Object.freeze({
  DATA_SOURCES_ARE_PROCESSING: 2,
  DATA_SOURCES_PROCEEDED: 3
});

export const IS_EXISTING_USER = "isExistingUser";

const getEligibleDataSources = (dataSources) => dataSources.filter(({ type }) => ![ENVIRONMENT, AZURE_TENANT].includes(type));

const TopAlertWrapper = ({ blacklistIds = [] }) => {
  const dispatch = useDispatch();

  const { organizationId } = useOrganizationInfo();

  const storedAlerts = useAllAlertsSelector(organizationId);

  const {
    apiData: { cloudAccounts = [] }
  } = useApiData(GET_DATA_SOURCES);

  const { isDataReady: isDataSourceReady } = useApiState(GET_DATA_SOURCES, organizationId);

  const eligibleDataSources = getEligibleDataSources(cloudAccounts);

  const hasDataSourceInProcessing = eligibleDataSources.some(({ last_import_at: lastImportAt }) => lastImportAt === 0);

  const updateOrganizationTopAlert = useCallback(
    (alert) => {
      dispatch(updateOrganizationTopAlertActionCreator(organizationId, alert));
    },
    [dispatch, organizationId]
  );

  useEffect(() => {
    const isDataSourcedProcessingAlertClosed = storedAlerts.some(
      ({ id, closed }) => id === ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING && closed
    );

    // "recharging" message about processing if closed, when no items are been processed
    if (isDataSourceReady && !hasDataSourceInProcessing && isDataSourcedProcessingAlertClosed) {
      updateOrganizationTopAlert({ id: ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING, closed: false });
    }
  }, [hasDataSourceInProcessing, isDataSourceReady, storedAlerts, updateOrganizationTopAlert]);

  const alerts = useMemo(() => {
    const isDataSourcesAreProceedingAlertTriggered = storedAlerts.some(
      ({ id, triggered }) => id === ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING && triggered
    );

    const isTriggered = (alertId) => {
      const { triggered = false } = storedAlerts.find(({ id }) => id === alertId) || {};
      return triggered;
    };

    return [
      {
        id: ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING,
        condition: isDataSourceReady && hasDataSourceInProcessing,
        getContent: () => <FormattedMessage id="someDataSourcesAreProcessing" />,
        onClose: () => {
          updateOrganizationTopAlert({ id: ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING, closed: true });
        },
        triggered: isTriggered(ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING),
        onTrigger: () => {
          updateOrganizationTopAlert({ id: ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING, triggered: true });
        },
        dataTestId: "top_alert_data_processing"
      },
      {
        id: ALERT_TYPES.DATA_SOURCES_PROCEEDED,
        condition: isDataSourceReady && !hasDataSourceInProcessing && isDataSourcesAreProceedingAlertTriggered,
        getContent: () => <FormattedMessage id="allDataSourcesProcessed" />,
        type: "success",
        triggered: isTriggered(ALERT_TYPES.DATA_SOURCES_PROCEEDED),
        onTrigger: () => {
          updateOrganizationTopAlert({ id: ALERT_TYPES.DATA_SOURCES_PROCEEDED, triggered: true });
        },
        onClose: () => {
          updateOrganizationTopAlert({ id: ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING, closed: false, triggered: false });
          updateOrganizationTopAlert({ id: ALERT_TYPES.DATA_SOURCES_PROCEEDED, closed: false, triggered: false });
        },
        dataTestId: "top_alert_data_proceeded"
      }
    ];
  }, [
    storedAlerts,
    isDataSourceReady,
    hasDataSourceInProcessing,
    updateOrganizationTopAlert
  ]);

  const currentAlert = useMemo(
    () =>
      alerts
        .filter(({ condition }) => condition)
        // white list of notifications which might be showed on login page
        .filter(({ id }) => !blacklistIds.includes(id))
        // alerts are processed in order as they present in array => we show first non closed alert
        .find((alertDefinition) => {
          const { closed } = storedAlerts.find(({ id }) => id === alertDefinition.id) || {};
          return !closed;
        }),
    [alerts, blacklistIds, storedAlerts]
  );

  return currentAlert ? <TopAlert alert={currentAlert} /> : null;
};

export default TopAlertWrapper;
