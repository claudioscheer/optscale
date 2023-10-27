import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import CheckboxLoader from "components/CheckboxLoader";

export const HAVA_INTEGRATION_ENABLED_FIELD_NAME = "enabled";

const HavaIntegrationEnabledCheckbox = ({ isLoading }) => {
  const { control } = useFormContext();

  return isLoading ? (
    <CheckboxLoader fullWidth />
  ) : (
    <FormControlLabel
      control={
        <Controller
          name={HAVA_INTEGRATION_ENABLED_FIELD_NAME}
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <Checkbox
              data-test-id="checkbox_auto_extension"
              checked={value}
              {...rest}
              onChange={(event) => onChange(event.target.checked)}
            />
          )}
        />
      }
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FormattedMessage id="havaEnabledFieldName" />
        </div>
      }
    />
  );
};
HavaIntegrationEnabledCheckbox.propTypes = {
  isLoading: PropTypes.bool
};

export default HavaIntegrationEnabledCheckbox;
