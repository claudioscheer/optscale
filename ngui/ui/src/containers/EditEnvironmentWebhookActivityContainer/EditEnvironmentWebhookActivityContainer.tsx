import Switch from "@mui/material/Switch";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { updateWebhook } from "api";

const EditEnvironmentWebhookActivityContainer = ({ webhookId, isActive = false }) => {
  const dispatch = useDispatch();

  const toggle = (newIsActive) => dispatch(updateWebhook(webhookId, { active: newIsActive }));

  return <Switch checked={isActive} onClick={(e) => toggle(e.target.checked)} />;
};

export default EditEnvironmentWebhookActivityContainer;
