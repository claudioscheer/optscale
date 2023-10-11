import React from "react";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateWebhook } from "api";

const EditEnvironmentWebhookActivityContainer = ({ webhookId, isActive = false }) => {
  const dispatch = useDispatch();

  const toggle = (newIsActive) => dispatch(updateWebhook(webhookId, { active: newIsActive }));

  return <Switch checked={isActive} onClick={(e) => toggle(e.target.checked)} />;
};

EditEnvironmentWebhookActivityContainer.propTypes = {
  webhookId: PropTypes.string.isRequired,
  isActive: PropTypes.bool
};

export default EditEnvironmentWebhookActivityContainer;
