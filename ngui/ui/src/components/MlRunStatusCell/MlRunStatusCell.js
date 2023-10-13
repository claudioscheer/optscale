import React from "react";
import PropTypes from "prop-types";
import CaptionedCell from "components/CaptionedCell";
import MlRunStatus from "components/MlRunStatus/MlRunStatus";
import { ML_RUN_STATUS } from "utils/constants";

const MlRunStatusCell = ({ reason, status }) => (
  <CaptionedCell caption={[ML_RUN_STATUS.FAILED, ML_RUN_STATUS.ABORTED].includes(status) ? reason : undefined}>
    <MlRunStatus status={status} />
  </CaptionedCell>
);

MlRunStatusCell.propTypes = {
  status: PropTypes.string.isRequired,
  reason: PropTypes.string,
  status_description: PropTypes.object
};

export default MlRunStatusCell;
