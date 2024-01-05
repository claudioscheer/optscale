import React from "react";
import { useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Input from "components/Input";

const HavaApiKeyInput = ({ name }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const intl = useIntl();

  return (
    <Input
      dataTestId="input_hava_api_key"
      label={<FormattedMessage id="havaApiKeyFieldName" />}
      required
      autoFocus
      error={!!errors[name]}
      helperText={errors[name] && errors[name].message}
      {...register(name, {
        required: {
          value: true,
          message: intl.formatMessage({ id: "thisFieldIsRequired" })
        }
      })}
    />
  );
};

export default HavaApiKeyInput;
