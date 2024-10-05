// hooks/useApiInstance.ts
import { useUserApi } from "../apis/userApi";
import { useAuthApi } from "../apis/authApi";
import { useAdminApi } from "../apis/adminApi";
import { useMirrorNodeApi } from "../apis/mirrorNodeApi";
import { useTransactionApi } from "../apis/transactionApi";
import { useIntegrationsApi } from "../apis/integrationsApi";
import { useCampaignApi } from "../apis/campaignApi";

export const useApiInstance = () => {
  const userApi = useUserApi();
  const authApi = useAuthApi();
  const adminApi = useAdminApi();
  const mirrorNodeApi = useMirrorNodeApi();
  const transactionApi = useTransactionApi();
  const integrationsApi = useIntegrationsApi();
  const campaignApi = useCampaignApi();

  return { userApi, authApi, adminApi, mirrorNodeApi, transactionApi, integrationsApi, campaignApi };
};
