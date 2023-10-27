import React from "react";
import PropTypes from "prop-types";
import ButtonLoader from "components/ButtonLoader";
import FormButtonsWrapper from "components/FormButtonsWrapper";

const HavaIntegrationFormButtons = ({ isLoading = false }) => (
  <FormButtonsWrapper>
    <ButtonLoader
      messageId="save"
      dataTestId="btn_save"
      color="primary"
      variant="contained"
      type="submit"
      isLoading={isLoading}
    />
  </FormButtonsWrapper>
);

HavaIntegrationFormButtons.propTypes = {
  isLoading: PropTypes.bool
};

export default HavaIntegrationFormButtons;
