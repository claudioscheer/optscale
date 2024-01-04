import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Stack } from "@mui/material";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { useNavigate } from "react-router-dom";
import CloudLabel from "components/CloudLabel";
import ExecutorLabel from "components/ExecutorLabel";
import FormattedMoney from "components/FormattedMoney";
import KeyValueLabel from "components/KeyValueLabel";
import LastModelRunGoals from "components/LastModelRunGoals";
import Markdown from "components/Markdown";
import SummaryList from "components/SummaryList";
import TypographyLoader from "components/TypographyLoader";
import { getEditMlModelUrl } from "urls";
import { ML_MODEL_DETAILS_TAB_NAME } from "utils/constants";
import { getTimeDistance } from "utils/datetime";
import { SPACING_2 } from "utils/layouts";
import { getQueryParams } from "utils/network";
import { isEmpty as isEmptyObject } from "utils/objects";

const LastRunExecutorSummary = ({ isLoading, lastRunExecutor }) => {
  const {
    instance_region: instanceRegion,
    instance_id: instanceId,
    instance_type: instanceType,
    platform_type: platformType,
    resource,
    discovered
  } = lastRunExecutor ?? {};

  return (
    <SummaryList
      titleMessage={<FormattedMessage id="lastRunExecutor" />}
      isLoading={isLoading}
      items={[
        lastRunExecutor && (
          <ExecutorLabel
            key="executor_label"
            discovered={discovered}
            resource={resource}
            instanceId={instanceId}
            platformType={platformType}
          />
        ),
        <KeyValueLabel
          key="cloud"
          messageId="cloud"
          value={
            resource && resource.cloud_account ? (
              <CloudLabel
                id={resource.cloud_account.id}
                name={resource.cloud_account.name}
                type={resource.cloud_account.type}
              />
            ) : undefined
          }
        />,
        <KeyValueLabel key="name" messageId="name" value={resource?.name} />,
        <KeyValueLabel key="region" messageId="region" value={instanceRegion} />,
        <KeyValueLabel key="size" messageId="size" value={instanceType} />
      ]}
    />
  );
};

const SummaryInfo = ({
  taskId,
  taskKey,
  lastRunReachedGoals,
  lastRunGoals,
  runsCount,
  isLoading,
  lastSuccessfulRunTimestamp,
  lastRunCost,
  ownerName,
  lastRunExecutor
}) => {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexWrap="wrap" rowGap={1} columnGap={16}>
      <Box>
        <SummaryList
          titleMessage={<FormattedMessage id="trackedMetrics" />}
          titleIconButton={{
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => {
              const { [ML_MODEL_DETAILS_TAB_NAME]: mlModelDetailsTabName } = getQueryParams();
              navigate(
                getEditMlModelUrl(taskId, {
                  tab: "metrics",
                  [ML_MODEL_DETAILS_TAB_NAME]: mlModelDetailsTabName
                })
              );
            }
          }}
          isLoading={isLoading}
          items={
            isEmptyObject(lastRunReachedGoals) ? (
              <FormattedMessage id="thereAreNoMetricsDefinedForModel" />
            ) : (
              <LastModelRunGoals lastRunGoals={lastRunGoals} modelReachedGoals={lastRunReachedGoals} />
            )
          }
        />
      </Box>
      <Box>
        <SummaryList
          titleMessage={<FormattedMessage id="summary" />}
          isLoading={isLoading}
          items={[
            <KeyValueLabel key="key" messageId="key" value={taskKey} />,
            <KeyValueLabel key="runs" messageId="runs" value={<FormattedNumber value={runsCount} />} />,
            <KeyValueLabel
              key="lastSuccessfulRun"
              messageId="lastSuccessfulRun"
              value={
                <FormattedMessage
                  id={lastSuccessfulRunTimestamp === 0 ? "never" : "valueAgo"}
                  values={{
                    value: lastSuccessfulRunTimestamp ? getTimeDistance(lastSuccessfulRunTimestamp) : null
                  }}
                />
              }
            />,
            <KeyValueLabel key="lastRunCost" messageId="lastRunCost" value={<FormattedMoney value={lastRunCost} />} />,
            <KeyValueLabel key="owner" messageId="owner" value={ownerName} />
          ]}
        />
      </Box>
      <Box>
        <LastRunExecutorSummary isLoading={isLoading} lastRunExecutor={lastRunExecutor} />
      </Box>
    </Box>
  );
};

const ModelDetailsSummary = ({ model, isModelDetailsLoading = false }) => {
  const {
    id: taskId,
    key: taskKey,
    description,
    last_run_cost: lastRunCost = 0,
    run_goals: lastRunGoals = [],
    owner: { name: ownerName } = {},
    last_successful_run: lastSuccessfulRunTimestamp,
    runs_count: runsCount = 0,
    last_run_executor: lastRunExecutor,
    last_run_reached_goals: lastRunReachedGoals = {}
  } = model;

  return (
    <Stack spacing={SPACING_2}>
      {isModelDetailsLoading ? (
        <TypographyLoader linesCount={4} />
      ) : (
        description && (
          <div>
            <Markdown>{description}</Markdown>
          </div>
        )
      )}
      <div>
        <SummaryInfo
          taskId={taskId}
          taskKey={taskKey}
          lastRunReachedGoals={lastRunReachedGoals}
          lastRunGoals={lastRunGoals}
          runsCount={runsCount}
          isLoading={isModelDetailsLoading}
          lastSuccessfulRunTimestamp={lastSuccessfulRunTimestamp}
          lastRunCost={lastRunCost}
          ownerName={ownerName}
          lastRunExecutor={lastRunExecutor}
        />
      </div>
    </Stack>
  );
};

export default ModelDetailsSummary;
