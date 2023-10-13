import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import ButtonLoader from "components/ButtonLoader";
import TextBlock from "components/TextBlock";
import HavaIcon from "icons/HavaIcon";
import Integration from "../Integration";
import Title from "../Title";

export const HAVA_INTEGRATION = "hava";

const Hava = ({
  slackInstallationPath,
  totalEmployees,
  connectedEmployees,
  isCurrentEmployeeConnectedToSlack,
  isLoadingProps = {}
}) => {
  const { isGetEmployeesLoading = false, isGetSlackInstallationPathLoading = false } = isLoadingProps;

  return (
    <Integration
      id={HAVA_INTEGRATION}
      title={<Title icon={<HavaIcon />} label={<FormattedMessage id="hava" />} />}
      button={
        <ButtonLoader
          messageId="addHavaIntegration"
          isLoading={isGetSlackInstallationPathLoading}
          startIcon={<HavaIcon />}
          color="primary"
          href={slackInstallationPath}
        />
      }
      blocks={[
        <TextBlock key="description1" messageId="integrationsSlackDescription1" />,
        <TextBlock
          key="slackConnected"
          messageId="integrationsSlackConnected"
          isVisible={isCurrentEmployeeConnectedToSlack}
          color="success"
        />,
        <TextBlock
          key="description2"
          messageId="integrationsSlackDescription2"
          isLoading={isGetEmployeesLoading}
          values={{
            total: totalEmployees,
            connected: connectedEmployees,
            strong: (chunks) => <strong>{chunks}</strong>
          }}
        />,
        <TextBlock key="description3" messageId="integrationsSlackDescription3" />
      ]}
    />
  );
};

Hava.propTypes = {
  isLoadingProps: PropTypes.object,
  totalEmployees: PropTypes.number,
  connectedEmployees: PropTypes.number,
  isCurrentEmployeeConnectedToSlack: PropTypes.bool,
  slackInstallationPath: PropTypes.string
};

export default Hava;
