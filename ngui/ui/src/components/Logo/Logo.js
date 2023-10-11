import React from "react";
import Link from "@mui/material/Link";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import logo from "assets/logo/logo.svg";
import logoShortWhite from "assets/logo/logo_short_white.svg";
import logoFullWhite from "assets/logo/logo_white.svg";
import { HOME } from "urls";
import { LOGO_SIZE } from "utils/constants";
import { capitalize } from "utils/strings";

const logosMap = {
  logoFullWhite,
  logoShortWhite,
  logo
};

const getLogo = (white, size) => {
  if (white) {
    return logosMap[`logo${capitalize(size)}White`];
  }
  return logosMap.logo;
};

const Logo = ({
  dataTestId,
  active = false,
  white = false,
  width = "auto",
  height = "auto",
  size = LOGO_SIZE.FULL
}) => {
  const intl = useIntl();

  const renderLogo = (
    <img
      width={width}
      height={height}
      src={getLogo(white, size)}
      alt={intl.formatMessage({ id: "optscale" })}
      data-test-id={dataTestId}
    />
  );

  return active ? (
    <Link component={RouterLink} to={HOME}>
      {renderLogo}
    </Link>
  ) : (
    renderLogo
  );
};

Logo.propTypes = {
  dataTestId: PropTypes.string,
  active: PropTypes.bool,
  white: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOf([LOGO_SIZE.FULL, LOGO_SIZE.SHORT])
};

export default Logo;
