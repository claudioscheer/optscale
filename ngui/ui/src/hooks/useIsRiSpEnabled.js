import { useIsFeatureEnabled } from "./useIsFeatureEnabled";

export const useIsRiSpEnabled = () => {
  const isFeatureEnabled = useIsFeatureEnabled("ri_sp_enabled");

  return isFeatureEnabled;
};
