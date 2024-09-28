import { AdminUpdatePassword, AllTokensQuery, ContractInfo, CurrentUser, TokenDataObj, TokenInfo, UpdatePasswordResponse } from "../../types";
import useDebounncedRequests from "../hooks/useDebouncedRequest";

export const useAdminApi = () => {
  const { put, get, post, patch } = useDebounncedRequests();

  const Admin = {
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> =>
      put<UpdatePasswordResponse>("/api/admin/update-password", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to update password");
        }
        return response;
      }),
    getTokenInfo: (tokenId: string): Promise<TokenInfo> =>
      post<TokenInfo>("/api/admin/token-info", { tokenId }).then((response) => {
        if (!response) {
          throw new Error("Failed to fetch token info");
        }
        return response;
      }),
    getPendingCards: () => get("/api/admin/twitter-pending-cards"),
    addNewToken: ({ token_id, tokendata, token_type, token_symbol, decimals }: { token_id: string; tokendata: any; token_type: string; token_symbol: String; decimals: Number }): Promise<{ message: string; data: TokenDataObj }> =>
      post<{ message: string; data: TokenDataObj }>("/api/admin/list-token", { token_id, token_symbol, tokendata, decimals, token_type }).then((response) => {
        if (!response) {
          throw new Error("Failed to add new token");
        }
        return response;
      }),
    getListedTokens: (tokenId?: string): Promise<AllTokensQuery> =>
      get<AllTokensQuery>(`/api/admin/listed-tokens${tokenId ? `?tokenId=${tokenId}` : ""}`).then((response) => {
        if (!response) {
          throw new Error("Failed to fetch listed tokens");
        }
        return response;
      }),
    getActiveContractInfo: (): Promise<ContractInfo> =>
      get<ContractInfo>("/api/admin/active-contract").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch active contract info");
        }
        return response;
      }),
    updateStatus: (data: any) => put("/api/admin/update-status", data),
    getAllUsers: (data?: { limit: number; offset: number }): Promise<{ users: CurrentUser[]; count: number }> =>
      post<{ users: CurrentUser[]; count: number }>("/api/admin/user/all", data ?? {}).then((response) => {
        if (!response) {
          throw new Error("Failed to fetch all users");
        }
        return response;
      }),
    allowUserAsCampaigner: (id: number): Promise<{ user: CurrentUser; success: true }> =>
      patch<{ user: CurrentUser; success: true }>("/api/admin/user/allowCampaigner", { id }).then((response) => {
        if (!response) {
          throw new Error("Failed to allow user as campaigner");
        }
        return response;
      }),
    removePerosnalHandle: (userId: number): Promise<{ data: CurrentUser; message: string }> =>
      patch<{ data: CurrentUser; message: string }>("/api/admin/personal-handle", { userId }).then((response) => {
        if (!response) {
          throw new Error("Failed to remove personal handle");
        }
        return response;
      }),
    removeBizHandle: (userId: number): Promise<{ data: CurrentUser; message: string }> =>
      patch<{ data: CurrentUser; message: string }>("/api/admin/biz-handle", { userId }).then((response) => {
        if (!response) {
          throw new Error("Failed to remove business handle");
        }
        return response;
      }),
  };

  return { ...Admin };
};

export default useAdminApi;
