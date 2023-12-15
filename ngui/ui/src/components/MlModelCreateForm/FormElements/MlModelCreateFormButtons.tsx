import Button from "components/Button";
import ButtonLoader from "components/ButtonLoader";
import FormButtonsWrapper from "components/FormButtonsWrapper";

const MlModelCreateFormButtons = ({ onCancel, isLoading = false }) => (
  <FormButtonsWrapper>
    <ButtonLoader
      messageId="save"
      dataTestId="btn_save"
      color="primary"
      variant="contained"
      type="submit"
      isLoading={isLoading}
    />
    <Button messageId="cancel" dataTestId="btn_cancel" onClick={onCancel} />
  </FormButtonsWrapper>
);

export default MlModelCreateFormButtons;
