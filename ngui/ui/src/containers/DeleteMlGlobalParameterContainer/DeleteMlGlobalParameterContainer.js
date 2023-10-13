import React from "react";
import PropTypes from "prop-types";
import DeleteEntity from "components/DeleteEntity";
import MlModelsService from "services/MlModelsService";

const DeleteMlGlobalParameterContainer = ({ id, name, onCancel }) => {
  const { useDeleteGlobalParameter } = MlModelsService();

  const { onDelete, isLoading } = useDeleteGlobalParameter();

  const onDeleteHandler = () => onDelete(id).then(() => onCancel());

  return (
    <DeleteEntity
      onCancel={onCancel}
      isLoading={isLoading}
      deleteButtonProps={{
        onDelete: onDeleteHandler
      }}
      dataTestIds={{
        text: "p_delete",
        deleteButton: "btn_smodal_delete",
        cancelButton: "btn_cancel"
      }}
      message={{
        messageId: "deleteGlobalPropertyQuestion",
        values: {
          name
        }
      }}
    />
  );
};

DeleteMlGlobalParameterContainer.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DeleteMlGlobalParameterContainer;
