import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DeleteEntity from "components/DeleteEntity";
import MlRunsetTemplatesService from "services/MlRunsetTemplatesService";
import { ML_RUNSET_TEMPLATES } from "urls";

const DeleteMlRunsetTemplateContainer = ({ id, onCancel }) => {
  const navigate = useNavigate();

  const { useDeleteMlRunsetTemplate } = MlRunsetTemplatesService();

  const { onDelete, isLoading } = useDeleteMlRunsetTemplate();

  const onSubmit = () => onDelete(id).then(() => navigate(ML_RUNSET_TEMPLATES));

  return (
    <DeleteEntity
      onDelete={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      deleteButtonProps={{
        color: "error",
        variant: "contained",
        onDelete: onSubmit
      }}
      dataTestIds={{
        text: "p_delete_pool",
        deleteButton: "btn_sm_delete",
        cancelButton: "btn_sm_cancel"
      }}
      message={{
        messageId: "deleteRunsetTemplateQuestion"
      }}
    />
  );
};

DeleteMlRunsetTemplateContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DeleteMlRunsetTemplateContainer;
