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

export default DeleteMlGlobalParameterContainer;
