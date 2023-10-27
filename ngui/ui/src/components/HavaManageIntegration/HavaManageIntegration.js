import React from "react";
import { Link, Box } from "@mui/material";
import { Stack } from "@mui/system";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import ActionBar from "components/ActionBar";
import PageContentWrapper from "components/PageContentWrapper";
import { INTEGRATIONS } from "urls";
import { SPACING_2 } from "utils/layouts";
import HavaIntegrationForm from "components/HavaIntegrationForm";

const HavaManageIntegration = ({ havaOrganization, isLoading, onSubmit }) => {
  return (
    <>
      <ActionBar
        data={{
          breadcrumbs: [
            <Link key={1} to={INTEGRATIONS} component={RouterLink}>
              <FormattedMessage id="integrations" />
            </Link>
          ],
          title: {
            text: <FormattedMessage id="havaManageIntegrationTitle" />,
            dataTestId: "lbl_hava_manage_integration"
          }
        }}
      />
      <PageContentWrapper>
        <Box
          sx={{
            width: { md: "50%" }
          }}
        >
          <Stack spacing={SPACING_2}>
            <HavaIntegrationForm havaOrganization={havaOrganization} isLoading={isLoading} onSubmit={onSubmit} />
          </Stack>
        </Box>
      </PageContentWrapper>
    </>
  );
};

HavaManageIntegration.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  organizationId: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  havaOrganization: PropTypes.shape({
    organizationId: PropTypes.object,
    enabled: PropTypes.bool,
    havaApiKey: PropTypes.string
  }).isRequired
};

export default HavaManageIntegration;
