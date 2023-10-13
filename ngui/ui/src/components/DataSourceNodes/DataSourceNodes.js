import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import PropTypes from "prop-types";
import DataSourceNodesTable from "components/DataSourceNodesTable";
import { UpdateCostModelModal } from "components/SideModalManager/SideModals";
import { useOpenSideModal } from "hooks/useOpenSideModal";

const DataSourceNodes = ({ cloudAccountId, costModel = {}, nodes, isLoading = false }) => {
  const openSideModal = useOpenSideModal();

  const actionBarDefinition = {
    items: [
      {
        key: "updateCostModel",
        icon: <SettingsIcon fontSize="small" />,
        messageId: "updateCostModel",
        variant: "text",
        action: () => openSideModal(UpdateCostModelModal, { cloudAccountId, costModel }),
        type: "button",
        requiredActions: ["MANAGE_CLOUD_CREDENTIALS"],
        dataTestId: "btn_update_cost_model"
      }
    ]
  };

  return (
    <DataSourceNodesTable
      nodes={nodes}
      isLoading={isLoading}
      actionBar={{
        show: true,
        definition: actionBarDefinition
      }}
    />
  );
};

DataSourceNodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  cloudAccountId: PropTypes.string.isRequired,
  costModel: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
};

export default DataSourceNodes;
