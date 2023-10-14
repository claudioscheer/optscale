import React from "react";
import { Link } from "@mui/material";
import { Stack } from "@mui/system";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import ActionBar from "components/ActionBar";
import PageContentWrapper from "components/PageContentWrapper";
import { INTEGRATIONS } from "urls";
import { SPACING_2 } from "utils/layouts";

const HavaManageIntegration = ({ havaOrganizationData }) => (
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
      <Stack spacing={SPACING_2}>
        <div>{JSON.stringify(havaOrganizationData)}</div>
      </Stack>
    </PageContentWrapper>
  </>
);

HavaManageIntegration.propTypes = {
  havaOrganizationData: PropTypes.shape({
    organization: PropTypes.object,
    havaIntegrated: PropTypes.bool
  }).isRequired
};

export default HavaManageIntegration;
