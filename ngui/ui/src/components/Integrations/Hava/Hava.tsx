import React from "react";
import { FormattedMessage } from "react-intl";
import ButtonLoader from "components/ButtonLoader";
import TextBlock from "components/TextBlock";
import HavaIcon from "icons/HavaIcon";
import { HAVA_MANAGE_INTEGRATION } from "urls";
import Integration from "../Integration";
import Title from "../Title";

export const HAVA_INTEGRATION = "hava";

const Hava = ({ isOrganizationConnectedToHava, isLoadingProps = {} }) => {
  const { isGetOrganizationConnectedLoading = false } = isLoadingProps;

  return (
    <Integration
      id={HAVA_INTEGRATION}
      title={<Title icon={<HavaIcon />} label={<FormattedMessage id="hava" />} />}
      button={
        <ButtonLoader
          messageId="addHavaIntegration"
          isLoading={isGetOrganizationConnectedLoading}
          startIcon={<HavaIcon />}
          color="primary"
          link={HAVA_MANAGE_INTEGRATION}
        />
      }
      blocks={[
        <TextBlock key="description1" messageId="integrationsHavaDescription1" />,
        <TextBlock
          key="slackConnected"
          messageId="integrationsHavaConnected"
          isVisible={isOrganizationConnectedToHava}
          color="success"
        />,
        <TextBlock
          key="slackNotConnected"
          messageId="integrationsHavaNotConnected"
          isVisible={!isOrganizationConnectedToHava}
          color="error"
        />,
        <TextBlock key="description2" messageId="integrationsHavaDescription2" />
      ]}
    />
  );
};

export default Hava;
