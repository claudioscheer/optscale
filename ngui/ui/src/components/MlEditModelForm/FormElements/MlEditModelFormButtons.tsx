import { Box } from "@mui/material";
import Button from "components/Button";
import ButtonLoader from "components/ButtonLoader";
import FormButtonsWrapper from "components/FormButtonsWrapper";
import { MlDeleteModelModal } from "components/SideModalManager/SideModals";
import { useOpenSideModal } from "hooks/useOpenSideModal";

const DeleteModelButton = ({ id, name }) => {
  const openSideModal = useOpenSideModal();

  return (
    <Button
      dataTestId="btn_delete"
      variant="contained"
      color="error"
      messageId="delete"
      onClick={() =>
        openSideModal(MlDeleteModelModal, {
          name,
          id
        })
      }
    />
  );
};

const MlEditModelFormButtons = ({ modelId, modelName, onCancel, isLoading = false }) => (
  <FormButtonsWrapper justifyContent="space-between">
    <Box display="flex">
      <ButtonLoader
        messageId="save"
        dataTestId="btn_save"
        color="primary"
        variant="contained"
        type="submit"
        isLoading={isLoading}
      />
      <Button messageId="cancel" dataTestId="btn_cancel" onClick={onCancel} />
    </Box>
    <DeleteModelButton id={modelId} name={modelName} />
  </FormButtonsWrapper>
);

export default MlEditModelFormButtons;
