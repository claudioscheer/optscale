import Grid from "@mui/material/Grid";
import { FormProvider, useForm } from "react-hook-form";
import CreateSshKeyNameField, { KEY_NAME_FIELD_ID } from "components/CreateSshKeyNameField";
import CreateSshKeyValueField, { KEY_VALUE_FIELD_ID } from "components/CreateSshKeyValueField";
import FormButtonsWrapper from "components/FormButtonsWrapper";
import InlineSeverityAlert from "components/InlineSeverityAlert";
import SubmitButtonLoader from "components/SubmitButtonLoader";
import { SPACING_2 } from "utils/layouts";

const CreateSshKey = ({ onSubmit, isSubmitLoading = false }) => {
  const methods = useForm({
    defaultValues: {
      [KEY_NAME_FIELD_ID]: "",
      [KEY_VALUE_FIELD_ID]: ""
    }
  });

  return (
    <Grid container spacing={SPACING_2}>
      <Grid item xs={12}>
        <InlineSeverityAlert messageDataTestId="ssh-hint" messageId="sshHint" />
      </Grid>
      <Grid item>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => {
              onSubmit(data);
              methods.reset(); // TODO: reset only on success
            })}
            noValidate
          >
            <CreateSshKeyNameField />
            <CreateSshKeyValueField />
            <FormButtonsWrapper>
              <SubmitButtonLoader
                messageId="add"
                isLoading={isSubmitLoading}
                dataTestId="btn_create_key"
                loaderDataTestId="btn_create_key_loader"
              />
            </FormButtonsWrapper>
          </form>
        </FormProvider>
      </Grid>
    </Grid>
  );
};

export default CreateSshKey;
