import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { FormattedMessage } from "react-intl";
import IconButton from "components/IconButton";
import { DeleteWebhookModal } from "components/SideModalManager/SideModals";
import { useOpenSideModal } from "hooks/useOpenSideModal";

const DeleteWebhook = ({ id, action, url }) => {
  const openSideModal = useOpenSideModal();

  return (
    <IconButton
      color="error"
      icon={<DeleteOutlinedIcon />}
      onClick={() => openSideModal(DeleteWebhookModal, { id, action, url })}
      tooltip={{
        show: true,
        value: <FormattedMessage id={"delete"} />
      }}
    />
  );
};

export default DeleteWebhook;
