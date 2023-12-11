import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import useStyles from "./SwitchField.styles";

const SwitchField = ({ name, labelMessageId, control, endAdornment = null, defaultValue = false, dataTestIds = {} }) => {
  const { classes } = useStyles();
  return (
    <FormControl fullWidth className={classes.formControl}>
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => (
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={{ "data-test-id": dataTestIds.input }}
              />
            )}
          />
        }
        label={
          <Typography data-test-id={dataTestIds.labelText}>
            <FormattedMessage id={labelMessageId} />
          </Typography>
        }
        className={classes.labelAdornedEnd}
      />
      {endAdornment}
    </FormControl>
  );
};

export default SwitchField;
