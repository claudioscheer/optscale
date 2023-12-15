import ButtonLoader from "components/ButtonLoader";
import { PROVIDERS } from "hooks/useNewAuthorization";
import GoogleIcon from "icons/GoogleIcon";
import { getEnvironmentVariable } from "utils/env";
import { useGoogleLogin } from "./hooks";

const GoogleAuthButton = ({ thirdPartySignIn, setIsAuthInProgress, isAuthInProgress, isRegistrationInProgress }) => {
  const clientId = getEnvironmentVariable("VITE_GOOGLE_OAUTH_CLIENT_ID");
  const { login, scriptLoadedSuccessfully } = useGoogleLogin({
    onSuccess: ({ code: token }) => thirdPartySignIn(PROVIDERS.GOOGLE, { token }),
    onError: (response = {}) => {
      setIsAuthInProgress(false);
      const { message = "", type = "", ...rest } = response;
      console.warn(`Google response failure ${message}: ${type}`, ...rest);
    },
    clientId
  });

  const isLoading = isAuthInProgress || isRegistrationInProgress || !scriptLoadedSuccessfully;
  const environmentNotSet = !clientId;

  return (
    <ButtonLoader
      variant="outlined"
      messageId="google"
      size="medium"
      onClick={() => {
        setIsAuthInProgress(true);
        login();
      }}
      startIcon={<GoogleIcon />}
      isLoading={isLoading}
      fullWidth
      tooltip={{
        show: environmentNotSet,
        messageId: "signInWithGoogleIsNotConfigured"
      }}
      disabled={environmentNotSet}
    />
  );
};

export default GoogleAuthButton;
