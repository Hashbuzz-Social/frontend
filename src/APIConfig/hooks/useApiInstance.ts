// hooks/useApiInstance.ts
import { useUserApi } from "../api/userApi";
// import { useAuthApi } from "../api/authApi";
// import { useAdminApi } from "../api/adminApi";
// import { useMirrorNodeApi } from "../api/mirrorNodeApi";
// import { useTransactionApi } from "../api/transactionApi";
// import { useIntegrationsApi } from "../api/integrationsApi";
// import { useCampaignApi } from "../api/campaignApi";

export const useApiInstance = () => {
  const userApi = useUserApi();
  // const authApi = useAuthApi();
  // const adminApi = useAdminApi();
  // const mirrorNodeApi = useMirrorNodeApi();
  // const transactionApi = useTransactionApi();
  // const integrationsApi = useIntegrationsApi();
  // const campaignApi = useCampaignApi();

  return { userApi };
};
