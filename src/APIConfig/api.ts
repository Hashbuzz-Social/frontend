import { AccountInfo } from "@hashgraph/sdk";
import axios, { AxiosResponse } from "axios";
import * as React from "react";
import {
  addCampaignBody, AdminLoginResponse, AdminUpdatePassword, AllTokensQuery, APIResponse, AuthCred, BalanceResponse, CampaignCards, Challenge, ContractInfo, CreateTransactionByteBody, CurrentUser, GenerateAstPayload, GnerateReseponse,
  PingResponseData, reimburseAmountBody, SetTransactionBody, TokenBalances, TokenDataObj, TokenInfo, TopUpResponse, updateCampaignStatusBody, UpdatePasswordResponse, WCChallange, WCVerifyResponseBody
} from "../types";
import { getCookieByName } from "../utils/helpers";
import { useAxios } from "./AxiosProvider";

export const useApiInstance = () => {
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = React.useState(false);

  const responseBody = (response: AxiosResponse) => response?.data;

  const handleRequest = async (request: Promise<AxiosResponse>) => {
    setIsLoading(true);
    try {
      const response = await request;
      return responseBody(response);
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requests = React.useMemo(
    () => ({
      get: (url: string, params?: {}) => handleRequest(axiosInstance.get(url, {
        params: params ?? {}, headers: {
          "Authorization": `Bearer ${getCookieByName("aSToken")}`
        }
      })),
      post: (url: string, body: {}) => handleRequest(axiosInstance.post(url, body)),
      put: (url: string, body: {}) => handleRequest(axiosInstance.put(url, body)),
      delete: (url: string) => handleRequest(axiosInstance.delete(url)),
      patch: (url: string, body: {}) => handleRequest(axiosInstance.patch(url, body)),
    }),
    [axiosInstance]
  );

  const User = React.useMemo(() => ({
    getCurrentUser: (): Promise<CurrentUser> => requests.get("/api/users/current"),
    updateConsent: (userData: { consent: boolean }): Promise<CurrentUser> => requests.patch(`/api/users/update-concent`, { ...userData }),
    updateWalletId: (userData: { walletId: string }): Promise<CurrentUser> => requests.put(`/api/users/update/wallet`, { ...userData }),
    getTokenBalances: (): Promise<TokenBalances[]> => requests.get("/api/users/token-balances"),
    getCardEngagement: (data: { id: number }): Promise<any> => requests.get("/api/campaign/card-status", { ...data }),
    getClaimRewards: (): Promise<any> => requests.get("/api/campaign/reward-details"),
    buttonClaimRewards: (data: any): Promise<any> => requests.put("api/campaign/claim-reward", data),
    syncTokenBal: (tokenId: string): Promise<{ balance: number }> => requests.get("/api/users/sync-bal/" + tokenId),
  }), [requests]);

  const Auth = React.useMemo(() => ({
    refreshToken: (refreshToken: string): Promise<AuthCred> => requests.post("/auth/refreshToken", { refreshToken }),
    doLogout: (): Promise<APIResponse<null>> => requests.post("/auth/logout", {}),
    adminLogin: (data: { password: string }): Promise<AdminLoginResponse> => requests.post("/auth/admin-login", { ...data }),
    authPing: (): Promise<APIResponse<PingResponseData>> => requests.get("/auth/ping"),
    hashconnect: {
      getHashconnectChallenge: (data: { url: string }): Promise<Challenge> => requests.get("/auth/hashconnect/create-challange", { ...data }),
      verifyHashconnectSign: (data: GenerateAstPayload): Promise<GnerateReseponse> => requests.post("/auth/hashconnect/verify-response", { ...data }),
    },
    walletConnect: {
      getWalletConnectChallenge: (): Promise<WCChallange> => requests.get("/auth/walletconnect/create-challange"),
      verifyWalletConnectSign: (data: WCVerifyResponseBody): Promise<GnerateReseponse> => requests.post("/auth/walletconnect/verify-response", { ...data }),
    },
  }), [requests]);

  const Admin = React.useMemo(() => ({
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> => requests.put("/api/admin/update-password", { ...data }),
    getTokenInfo: (tokenId: string): Promise<TokenInfo> => requests.post("/api/admin/token-info", { tokenId }),
    getPendingCards: () => requests.get("/api/admin/twitter-pending-cards"),
    addNewToken: ({ token_id, tokendata, token_type, token_symbol, decimals }: { token_id: string; tokendata: any; token_type: string; token_symbol: String; decimals: Number }): Promise<{ message: string; data: TokenDataObj }> => requests.post("/api/admin/list-token", { token_id, token_symbol, tokendata, decimals, token_type }),
    getListedTokens: (tokenId?: string): Promise<AllTokensQuery> => requests.get(`/api/admin/listed-tokens${tokenId ? `?tokenId=${tokenId}` : ""}`),
    getActiveContractInfo: (): Promise<ContractInfo> => requests.get("/api/admin/active-contract"),
    updateStatus: (data: any) => requests.put("/api/admin/update-status", data),
    getAllUsers: (data?: { limit: number; offset: number }): Promise<{ users: CurrentUser[]; count: number }> => requests.post("/api/admin/user/all", data ?? {}),
    allowUserAsCampaigner: (id: number): Promise<{ user: CurrentUser; success: true }> => requests.patch("/api/admin/user/allowCampaigner", { id }),
    removePerosnalHandle: (userId: number): Promise<{ data: CurrentUser; message: string }> => requests.patch("/api/admin/personal-handle", { userId }),
    removeBizHandle: (userId: number): Promise<{ data: CurrentUser; message: string }> => requests.patch("/api/admin/biz-handle", { userId }),
  }), [requests]);

  const MirrorNodeRestAPI = React.useMemo(() => ({
    getTokenInfo: (tokenId: string) => axios.get<TokenInfo>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/tokens/${tokenId}`),
    getBalancesForAccountId: (accountId: string) => axios.get<BalanceResponse>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/balances?account.id=${accountId}`),
    getAccoutnInfo: (accountId: string) => axios.get<AccountInfo>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/accounts/${accountId}`),
  }), []);

  const Transaction = React.useMemo(() => ({
    createTransactionBytes: (data: CreateTransactionByteBody): Promise<Uint8Array> => requests.post("/api/transaction/create-topup-transaction", { ...data }),
    setTransactionAmount: (data: SetTransactionBody): Promise<TopUpResponse> => requests.post("/api/transaction/top-up", { ...data }),
    reimburseAmount: (data: reimburseAmountBody): Promise<any> => requests.post("/api/transaction/reimbursement", { ...data }),
  }), [requests]);

  const Integrations = React.useMemo(() => ({
    twitterPersonalHandle: (): Promise<{ url: string }> => requests.get("/api/integrations/twitter/personalHandle"),
    twitterBizHandle: (): Promise<{ url: string }> => requests.get("/api/integrations/twitter/bizHandle"),
  }), [requests]);

  const Campaign = React.useMemo(() => ({
    addCampaign: (data: addCampaignBody): Promise<any> => requests.post("/api/campaign/add-new", { ...data }),
    getCampaigns: (): Promise<CampaignCards[]> => requests.get("/api/campaign/all"),
    updateCampaignStatus: (data: updateCampaignStatusBody): Promise<any> => requests.post("/api/campaign/update-status", { ...data }),
    chatResponse: (data: any): Promise<any> => requests.post("/api/campaign/chatgpt", data),
  }), [requests]);

  return { isLoading, User, Auth, Admin, MirrorNodeRestAPI, Transaction, Integrations, Campaign };
};

export default useApiInstance;