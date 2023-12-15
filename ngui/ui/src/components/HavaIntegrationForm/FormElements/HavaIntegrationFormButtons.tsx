import React from "react";
import Button from "components/Button";
import ButtonLoader from "components/ButtonLoader";
import FormButtonsWrapper from "components/FormButtonsWrapper";
import { useNavigate } from "react-router-dom";
import { INTEGRATIONS } from "urls";

const HavaIntegrationFormButtons = ({ isLoading = false }) => {
  const navigate = useNavigate();

  return (
    <FormButtonsWrapper>
      <ButtonLoader
        messageId="save"
        dataTestId="btn_save"
        color="primary"
        variant="contained"
        type="submit"
        isLoading={isLoading}
      />
      <Button
        messageId="cancel"
        dataTestId="btn_cancel"
        onClick={() => {
          navigate(INTEGRATIONS);
        }}
      />
    </FormButtonsWrapper>
  );
};

export default HavaIntegrationFormButtons;
