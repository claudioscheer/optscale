import { useState, Children, useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import CollapsableMenuDrawer from "components/CollapsableMenuDrawer";
import DocsPanel from "components/DocsPanel";
import ErrorBoundary from "components/ErrorBoundary";
import HeaderButtons from "components/HeaderButtons";
import Hidden from "components/Hidden";
import IconButton from "components/IconButton";
import Logo from "components/Logo";
import MainMenu from "components/MainMenu";
import PendingInvitationsAlert from "components/PendingInvitationsAlert";
import TopAlertWrapper from "components/TopAlertWrapper";
import MainLayoutContainer from "containers/MainLayoutContainer";
import OrganizationSelectorContainer from "containers/OrganizationSelectorContainer";
import { CommunityDocsContext } from "contexts/CommunityDocsContext";
import { useIsDownMediaQuery } from "hooks/useMediaQueries";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import { BASE_LAYOUT_CONTAINER_ID, LOGO_SIZE } from "utils/constants";
import useStyles from "./BaseLayout.styles";

const logoHeight = 45;

const getLogoSize = (isDownSm) => (isDownSm ? LOGO_SIZE.SHORT : LOGO_SIZE.FULL);

const AppToolbar = ({ onMenuIconClick, mainMenu, showMainMenu = false, showOrganizationSelector = false }) => {
  const { classes } = useStyles();
  const isDownMd = useIsDownMediaQuery("md");
  const isDownSm = useIsDownMediaQuery("sm");

  return (
    <Toolbar className={classes.toolbar}>
      {showMainMenu && (
        <IconButton
          sx={{ display: { xs: "inherit", md: "none" } }}
          customClass={classes.marginRight1}
          icon={<MenuIcon />}
          color="primary"
          onClick={onMenuIconClick}
          aria-label="open drawer"
        />
      )}
      <div style={{ height: logoHeight }} className={classes.logo}>
        <Logo size={getLogoSize(isDownMd, isDownSm)} dataTestId="img_logo" height={logoHeight} active />
      </div>
      <Box display="flex" alignItems="center">
        {showOrganizationSelector && <OrganizationSelectorContainer mainMenu={mainMenu} />}
        <HeaderButtons />
      </Box>
    </Toolbar>
  );
};

const BaseLayout = ({ children, showMainMenu = false, showOrganizationSelector = false, mainMenu }) => {
  const { organizationId } = useOrganizationInfo();

  const { classes, cx } = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { isCommunityDocsOpened } = useContext(CommunityDocsContext);

  return (
    <>
      <TopAlertWrapper />
      <Box className={cx(classes.wrapper, isCommunityDocsOpened ? classes.wrapperWithDocsOpened : "")}>
        <Box className={classes.layoutWrapper}>
          <PendingInvitationsAlert />
          <AppBar position="static" className={classes.appBar}>
            <AppToolbar
              showMainMenu={showMainMenu}
              onMenuIconClick={handleDrawerToggle}
              showOrganizationSelector={showOrganizationSelector}
              mainMenu={mainMenu}
            />
          </AppBar>
          <Box className={classes.menuAndContentWrapper}>
            {showMainMenu && (
              <>
                <Hidden mode="down" breakpoint="md">
                  <CollapsableMenuDrawer>
                    <MainMenu menu={mainMenu} />
                  </CollapsableMenuDrawer>
                </Hidden>
                <Hidden mode="up" breakpoint="md">
                  <Drawer
                    variant="temporary"
                    classes={{
                      paper: classes.drawerPaper
                    }}
                    onClose={handleDrawerToggle}
                    open={mobileOpen}
                    ModalProps={{
                      keepMounted: true
                    }}
                  >
                    <MainMenu menu={mainMenu} />
                  </Drawer>
                </Hidden>
              </>
            )}
            <Container key={organizationId} id={BASE_LAYOUT_CONTAINER_ID} component="main" className={classes.content}>
              <ErrorBoundary>
                <MainLayoutContainer>{Children.only(children)}</MainLayoutContainer>
              </ErrorBoundary>
            </Container>
          </Box>
        </Box>
        <Box>
          <DocsPanel />
        </Box>
      </Box>
    </>
  );
};

export default BaseLayout;
