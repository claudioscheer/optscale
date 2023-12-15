import Button from "components/Button";
import FormButtonsWrapper from "components/FormButtonsWrapper";
import SubmitButtonLoader from "components/SubmitButtonLoader";

const FormButtons = ({ isLoading, onCancel }) => (
  <FormButtonsWrapper>
    <SubmitButtonLoader variant="contained" color="primary" messageId="launch" type="submit" isLoading={isLoading} />
    <Button messageId="cancel" onClick={onCancel} />
  </FormButtonsWrapper>
);

export default FormButtons;
