import React from "react";
import { useIntl } from "react-intl";
import useStyles from "./HavaIcon.styles";
import logo from "./logo.png";

const HavaIcon = (props) => {
  const { classes } = useStyles();
  const intl = useIntl();

  return (
    <>
      <img
        width={props?.width || 24}
        height={props?.height || 21}
        src={logo}
        className={classes.icon}
        alt={intl.formatMessage({ id: "addHavaIntegration" })}
      />
    </>
  );
};

export default HavaIcon;
