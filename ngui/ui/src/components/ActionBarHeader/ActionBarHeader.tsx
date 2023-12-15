import { forwardRef, type JSX } from "react";
import Box from "@mui/material/Box";
import { FormattedMessage } from "react-intl";
import ActionBarHeaderLoader from "components/ActionBarHeaderLoader";
import Image from "components/Image";
import PageTitle from "components/PageTitle";
import useStyles from "./ActionBarHeader.styles";

type SrcOrIconType = { src: string; icon: never } | { src: never; icon: JSX.Element };

type LogoTypeCommonProps = {
  alt: string;
  dataTestId: string;
};

type TextType = string | JSX.Element | (() => JSX.Element);

type TextOrMessageIdType = { text: TextType; messageId: never } | { text: never; messageId: string };

type ActionBarHeaderCommonProps = {
  logo: LogoTypeCommonProps & SrcOrIconType;
  dataTestId: string;
  isLoading?: boolean;
  dataProductTourId?: string;
};

type ActionBarHeaderProps = ActionBarHeaderCommonProps & TextOrMessageIdType;

const renderText = (text: TextType) => (typeof text === "function" ? text() : text);

const ActionBarHeader = forwardRef<HTMLHeadingElement, ActionBarHeaderProps>(
  ({ text, messageId, isLoading, dataTestId, dataProductTourId, logo }, ref) => {
    const { classes } = useStyles();
    const { src = "", alt = "", dataTestId: logoDataTestId, icon = null } = logo ?? {};

    return isLoading ? (
      <ActionBarHeaderLoader />
    ) : (
      <>
        {src ? (
          <Box className={classes.logoWrapper} display="flex" mr={0.5} alignItems="center">
            <Image customClass={classes.logo} src={src} alt={alt} dataTestId={logoDataTestId} />
          </Box>
        ) : (
          <Box display="flex" mr={0.5} alignItems="center">
            {icon}
          </Box>
        )}
        <PageTitle dataProductTourId={dataProductTourId} dataTestId={dataTestId} className={classes.title} ref={ref}>
          {messageId ? <FormattedMessage id={messageId} /> : renderText(text)}
        </PageTitle>
      </>
    );
  }
);

export default ActionBarHeader;
