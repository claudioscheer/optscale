import React from "react";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { RESTAPI } from "api";
import { getApiUrl } from "api/utils";
import IconButton from "components/IconButton";
import { useFetchAndDownload } from "hooks/useFetchAndDownload";
import { DOWNLOAD_FILE_FORMATS } from "utils/constants";

const DownloadEnvironmentWebhookAuditLogsContainer = ({ webhookId }) => {
  const { isFileDownloading, fetchAndDownload } = useFetchAndDownload();

  const download = (format) => {
    fetchAndDownload({
      url: `${getApiUrl(RESTAPI)}/webhooks/${webhookId}/logs?format=${format}`,
      fallbackFilename: `${webhookId}.${format}`
    });
  };

  return (
    <IconButton
      icon={<CloudDownloadOutlinedIcon />}
      onClick={() => download(DOWNLOAD_FILE_FORMATS.XLSX)}
      tooltip={{
        show: true,
        value: <FormattedMessage id={"downloadAuditLogs"} />
      }}
      isLoading={isFileDownloading}
    />
  );
};

DownloadEnvironmentWebhookAuditLogsContainer.propTypes = {
  webhookId: PropTypes.string.isRequired
};

export default DownloadEnvironmentWebhookAuditLogsContainer;
