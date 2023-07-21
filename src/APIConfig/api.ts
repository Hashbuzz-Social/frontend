import axios, { AxiosInstance, AxiosResponse } from "axios";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import {
  AdminLoginResponse,
  AdminUpdatePassword,
  AllTokensQuery,
  AuthCred,
  BalanceResponse,
  Challenge,
  ContractInfo,
  CreateTransactionByteBody,
  CurrentUser,
  GenerateAstPayload,
  GnerateReseponse,
  LogoutResponse,
  SetTransactionBody,
  TokenBalances,
  TokenDataObj,
  TokenInfo,
  TopUpResponse,
  UpdatePasswordResponse,
} from "../types";
import {  getErrorMessage } from "../Utilities/helpers";

export const getCookie = (cname: string) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const useApiInstance = () => {
  const [cookies] = useCookies(["aSToken", "refreshToken", "adminToken"]);
  const instance = useRef<AxiosInstance>(
    axios.create({
      baseURL: process.env.REACT_APP_DAPP_API,
      timeout: 15000,
      headers: {
        Authorization: `aSToken ${cookies.aSToken}${cookies.adminToken ? `, Token ${cookies.adminToken}` : ""}`,
        "Content-type": "application/json",
      },
    })
  );

  instance.current.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("error from instance", error);
      // whatever you want to do with the error
      if (error?.response?.status === 401) {
        // handleLogout();
      }
      // throw error;
      toast.error(getErrorMessage(error));
    }
  );

  const responseBody = (response: AxiosResponse) => response.data;

  React.useEffect(() => {
    instance.current = axios.create({
      baseURL: process.env.REACT_APP_DAPP_API,
      timeout: 30000,
      headers: {
        Authorization: `aSToken ${cookies.aSToken}${cookies.adminToken ? `, Token ${cookies.adminToken}` : ""}`,
        "Content-type": "application/json",
      },
    });
  }, [cookies.adminToken, cookies.aSToken]);

  const requests = {
    get: (url: string , params?:{}) => instance.current.get(url , {params:params??{}}).then(responseBody),
    post: (url: string, body: {}) => instance.current.post(url, body).then(responseBody),
    put: (url: string, body: {}) => instance.current.put(url, body).then(responseBody),
    delete: (url: string) => instance.current.delete(url).then(responseBody),
    patch: (url: string, body: {}) => instance.current.patch(url, body).then(responseBody),
  };
  const User = {
    getCurrentUser: (): Promise<CurrentUser> => requests.get("/api/users/current"),
    updateConsent: (userData: { consent: boolean }): Promise<CurrentUser> => requests.patch(`/api/users/update-concent`, { ...userData }),
    updateWalletId: (userData: { walletId: string }): Promise<CurrentUser> => requests.put(`/api/users/update/wallet`, { ...userData }),
    getTokenBalances: (): Promise<TokenBalances[]> => requests.get("/api/users/token-balances"),
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> => requests.put("/api/users/update-password", { ...data }),
  };

  const Auth = {
    refreshToken: (refreshToken: string): Promise<AuthCred> => requests.post("/auth/refreshToken", { refreshToken }),
    doLogout: (): Promise<LogoutResponse> => requests.post("/auth/logout",{}),
    adminLogin: (data: { email: string; password: string }): Promise<AdminLoginResponse> => requests.post("/auth/admin-login", { ...data }),
    authPing: (): Promise<{ hedera_wallet_id: string }> => requests.get("/auth/ping" ),
    createChallenge: (data:{url:string}): Promise<Challenge> => requests.get("/auth/challenge", {...data}),
    generateAuth:(data:GenerateAstPayload):Promise<GnerateReseponse> => requests.post("/auth/generate",{...data})
  };

  const Admin = {
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> => requests.put("/api/admin/update-password", { ...data }),
    getTokenInfo: (tokenId: string): Promise<TokenInfo> => requests.post("/api/admin/token-info", { tokenId }),
    addNewToken: ({
      tokenId,
      tokenData,
      token_type,
    }: {
      tokenId: string;
      tokenData: TokenInfo;
      token_type: string;
    }): Promise<{ message: string; data: TokenDataObj }> => requests.post("/api/admin/list-token", { tokenId, tokenData, token_type }),
    getListedTokens: (tokenId?: string): Promise<AllTokensQuery> => requests.get(`/api/admin/listed-tokens${tokenId ? `?tokenId=${tokenId}` : ""}`),
    getActiveContractInfo: (): Promise<ContractInfo> => requests.get("/api/admin/active-contract"),
  };

  const MirrorNodeRestAPI = {
    getTokenInfo: (tokenId: string) => axios.get<TokenInfo>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/tokens/${tokenId}`),
    getBalancesForAccountId: (accountId: string) =>
      axios.get<BalanceResponse>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/balances?account.id=${accountId}`),
  };

  const Transaction = {
    createTransactionBytes: (data: CreateTransactionByteBody): Promise<any> =>
      requests.post("/api/transaction/create-topup-transaction", { ...data }),
    setTransactionAmount: (data: SetTransactionBody): Promise<TopUpResponse> => requests.post("/api/transaction/top-up", { ...data }),
  };

  const Integrations = {
    twitterPersonalHandle:():Promise<{url:string}> => requests.get("/api/integrations/twitter/personalHandle"),
    twitterBizHandle:():Promise<{url:string}> => requests.get("/api/integrations/twitter/bizHandle")
  }

  return { User, Auth, Admin, MirrorNodeRestAPI, Transaction  , Integrations};
};
