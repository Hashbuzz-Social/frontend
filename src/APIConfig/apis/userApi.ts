import { CurrentUser, TokenBalances } from "../../types";
import useDebounncedRequests from "../hooks/useDebouncedRequest";

export const useUserApi = () => {
  const { isLoading, get, patch, put } = useDebounncedRequests();

  const UserRequests = {
    getCurrentUser: (): Promise<CurrentUser> =>
      get<CurrentUser>("/api/users/current").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch current user");
        }
        return response;
      }),
    updateConsent: (userData: { consent: boolean }): Promise<CurrentUser> =>
      patch<CurrentUser>(`/api/users/update-concent`, { ...userData }).then((response) => {
        if (!response) {
          throw new Error("Failed to update consent");
        }
        return response;
      }),
    updateWalletId: (userData: { walletId: string }): Promise<CurrentUser> =>
      put<CurrentUser>(`/api/users/update/wallet`, { ...userData }).then((response) => {
        if (!response) {
          throw new Error("Failed to update wallet ID");
        }
        return response;
      }),
    getTokenBalances: (): Promise<TokenBalances[]> =>
      get<TokenBalances[]>("/api/users/token-balances").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch token balances");
        }
        return response;
      }),
    getCardEngagement: (data: { id: number }): Promise<any> => get("/api/campaign/card-status", { ...data }),
    getClaimRewards: (): Promise<any> => get("/api/campaign/reward-details"),
    buttonClaimRewards: (data: any): Promise<any> => put("api/campaign/claim-reward", data),
    syncTokenBal: (tokenId: string): Promise<{ balance: number }> =>
      get<{ balance: number }>("/api/users/sync-bal/" + tokenId).then((response) => {
        if (!response) {
          throw new Error("Failed to sync token balance");
        }
        return response;
      }),
  };

  return { isLoading, ...UserRequests };
};

export default useUserApi;
