import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Button from "components/Button";
import ButtonLoader from "components/ButtonLoader";
import DeleteBIExport from "components/DeleteBIExport";
import FormButtonsWrapper from "components/FormButtonsWrapper";

const FormButtons = ({ onCancel, isEdit = false, isLoading = false }) => (
  <FormButtonsWrapper justifyContent="space-between">
    <Box display="flex">
      <ButtonLoader
        messageId={isEdit ? "save" : "create"}
        dataTestId="btn_save"
        color="primary"
        variant="contained"
        type="submit"
        isLoading={isLoading}
      />
      <Button messageId="cancel" dataTestId="btn_cancel" onClick={onCancel} />
    </Box>
    {isEdit ? <DeleteBIExport /> : null}
  </FormButtonsWrapper>
);

FormButtons.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isEdit: PropTypes.bool
};

export default FormButtons;
