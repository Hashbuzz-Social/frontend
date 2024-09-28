import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import * as React from "react";

import { addCampaignBody, AdminLoginResponse, AdminUpdatePassword, AllTokensQuery, AuthCred, BalanceResponse, CampaignCards, Challenge, ContractInfo, CreateTransactionByteBody, CurrentUser, GenerateAstPayload, GnerateReseponse, LogoutResponse, reimburseAmountBody, SetTransactionBody, TokenBalances, TokenDataObj, TokenInfo, TopUpResponse, updateCampaignStatusBody, UpdatePasswordResponse, WCChallange, WCVerifyResponseBody } from "../types";
import { useAxios } from "./AxiosProvider";

let cancelTokens: Record<string, CancelTokenSource> = {};

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

// Generic debounce function that preserves the types of the original function
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): ReturnType<T> | void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Call the original function with the provided arguments
      func(...args);
    }, wait);
  };
};

export const useDebouncedRequests = () => {
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = React.useState(false);

  const cancelRequest = (key: string) => {
    if (cancelTokens[key]) {
      cancelTokens[key].cancel(`Cancelled request for ${key}`);
      delete cancelTokens[key];
    }
  };

  // Dynamic typing enabled using generic type <T>
  const stateFullRequest = <T>(method: string, url: string, bodyOrParams?: {}, config?: AxiosRequestConfig): (() => Promise<T | undefined>) => {
    return async () => {
      setIsLoading(true);

      // Cancel the previous request with the same method and URL
      cancelRequest(method + url);

      const cancelTokenSource = axios.CancelToken.source();
      cancelTokens[method + url] = cancelTokenSource;

      try {
        const response = await axiosInstance({
          method,
          url,
          data: method !== "get" ? bodyOrParams : undefined,
          params: method === "get" ? bodyOrParams : undefined,
          cancelToken: cancelTokenSource.token,
          ...config,
        });

        return response.data as T; // Return the data as type T
      } catch (error) {
        if (axios.isCancel(error)) {
          //@ts-ignore
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error:", error);
          throw error; // Re-throw the error to be handled elsewhere
        }
      } finally {
        setIsLoading(false);
        delete cancelTokens[method + url];
      }
    };
  };

  return { isLoading, stateFullRequest };
};

export const useApiInstance = () => {
  const { isLoading, stateFullRequest } = useDebouncedRequests();

  // Defining the requests object using debounced methods and dynamic typing
  const requests = {
    get: async <T>(url: string, params?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("get", url, params, config), 500);
      return debouncedRequest();
    },
    post: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("post", url, data, config), 500);
      return debouncedRequest();
    },
    put: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("put", url, data, config), 500);
      return debouncedRequest();
    },
    patch: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("patch", url, data, config), 500);
      return debouncedRequest();
    },
    delete: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("delete", url, data, config), 500);
      return debouncedRequest();
    },
  };

  const User = {
    getCurrentUser: (): Promise<CurrentUser> =>
      requests.get<CurrentUser>("/api/users/current").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch current user");
        }
        return response;
      }),
    updateConsent: (userData: { consent: boolean }): Promise<CurrentUser> =>
      requests.patch<CurrentUser>(`/api/users/update-concent`, { ...userData }).then((response) => {
        if (!response) {
          throw new Error("Failed to update consent");
        }
        return response;
      }),
    updateWalletId: (userData: { walletId: string }): Promise<CurrentUser> =>
      requests.put<CurrentUser>(`/api/users/update/wallet`, { ...userData }).then((response) => {
        if (!response) {
          throw new Error("Failed to update wallet ID");
        }
        return response;
      }),
    getTokenBalances: (): Promise<TokenBalances[]> =>
      requests.get<TokenBalances[]>("/api/users/token-balances").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch token balances");
        }
        return response;
      }),
    getCardEngagement: (data: { id: number }): Promise<any> => requests.get("/api/campaign/card-status", { ...data }),
    getClaimRewards: (): Promise<any> => requests.get("/api/campaign/reward-details"),
    buttonClaimRewards: (data: any): Promise<any> => requests.put("api/campaign/claim-reward", data),
    syncTokenBal: (tokenId: string): Promise<{ balance: number }> =>
      requests.get<{ balance: number }>("/api/users/sync-bal/" + tokenId).then((response) => {
        if (!response) {
          throw new Error("Failed to sync token balance");
        }
        return response;
      }),
  };

  const Auth = {
    refreshToken: (refreshToken: string): Promise<AuthCred | void | undefined> => requests.post("/auth/refreshToken", { refreshToken }),
    doLogout: (): Promise<LogoutResponse> =>
      requests.post<LogoutResponse>("/auth/logout", {}).then((response) => {
        if (!response) {
          throw new Error("Failed to logout");
        }
        return response;
      }),
    adminLogin: (data: { password: string }): Promise<AdminLoginResponse> =>
      requests.post<AdminLoginResponse>("/auth/admin-login", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to login");
        }
        return response;
      }),
    authPing: (): Promise<{ wallet_id: string; status: string; device_id: string }> =>
      requests.get<{ wallet_id: string; status: string; device_id: string }>("/auth/ping").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch auth ping");
        }
        return response;
      }),
    hashconnect: {
      getHashconnectChallenge: (data: { url: string }): Promise<Challenge> =>
        requests.get<Challenge>("/auth/hashconnect/create-challange", { ...data }).then((response) => {
          if (!response) {
            throw new Error("Failed to fetch hashconnect challenge");
          }
          return response;
        }),
      verifyHashconnectSign: (data: GenerateAstPayload): Promise<GnerateReseponse> =>
        requests.post<GnerateReseponse>("/auth/hashconnect/verify-response", { ...data }).then((response) => {
          if (!response) {
            throw new Error("Failed to verify hashconnect sign");
          }
          return response;
        }),
    },
    walletConnect: {
      getWalletConnectChallenge: (): Promise<WCChallange> =>
        requests.get<WCChallange>("/auth/walletconnect/create-challange").then((response) => {
          if (!response) {
            throw new Error("Failed to fetch wallet connect challenge");
          }
          return response;
        }),
      verifyWalletConnectSign: (data: WCVerifyResponseBody): Promise<GnerateReseponse> =>
        requests.post<GnerateReseponse>("/auth/walletconnect/verify-response", { ...data }).then((response) => {
          if (!response) {
            throw new Error("Failed to verify wallet connect sign");
          }
          return response;
        }),
    },
  };

  const Admin = {
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> =>
      requests.put<UpdatePasswordResponse>("/api/admin/update-password", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to update password");
        }
        return response;
      }),
    getTokenInfo: (tokenId: string): Promise<TokenInfo> =>
      requests.post<TokenInfo>("/api/admin/token-info", { tokenId }).then((response) => {
        if (!response) {
          throw new Error("Failed to fetch token info");
        }
        return response;
      }),
    getPendingCards: () => requests.get("/api/admin/twitter-pending-cards"),
    addNewToken: ({ token_id, tokendata, token_type, token_symbol, decimals }: { token_id: string; tokendata: any; token_type: string; token_symbol: String; decimals: Number }): Promise<{ message: string; data: TokenDataObj }> =>
      requests.post<{ message: string; data: TokenDataObj }>("/api/admin/list-token", { token_id, token_symbol, tokendata, decimals, token_type }).then((response) => {
        if (!response) {
          throw new Error("Failed to add new token");
        }
        return response;
      }),
    getListedTokens: (tokenId?: string): Promise<AllTokensQuery> =>
      requests.get<AllTokensQuery>(`/api/admin/listed-tokens${tokenId ? `?tokenId=${tokenId}` : ""}`).then((response) => {
        if (!response) {
          throw new Error("Failed to fetch listed tokens");
        }
        return response;
      }),
    getActiveContractInfo: (): Promise<ContractInfo> =>
      requests.get<ContractInfo>("/api/admin/active-contract").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch active contract info");
        }
        return response;
      }),
    updateStatus: (data: any) => requests.put("/api/admin/update-status", data),
    getAllUsers: (data?: { limit: number; offset: number }): Promise<{ users: CurrentUser[]; count: number }> =>
      requests.post<{ users: CurrentUser[]; count: number }>("/api/admin/user/all", data ?? {}).then((response) => {
        if (!response) {
          throw new Error("Failed to fetch all users");
        }
        return response;
      }),
    allowUserAsCampaigner: (id: number): Promise<{ user: CurrentUser; success: true }> =>
      requests.patch<{ user: CurrentUser; success: true }>("/api/admin/user/allowCampaigner", { id }).then((response) => {
        if (!response) {
          throw new Error("Failed to allow user as campaigner");
        }
        return response;
      }),
    removePerosnalHandle: (userId: number): Promise<{ data: CurrentUser; message: string }> =>
      requests.patch<{ data: CurrentUser; message: string }>("/api/admin/personal-handle", { userId }).then((response) => {
        if (!response) {
          throw new Error("Failed to remove personal handle");
        }
        return response;
      }),
    removeBizHandle: (userId: number): Promise<{ data: CurrentUser; message: string }> =>
      requests.patch<{ data: CurrentUser; message: string }>("/api/admin/biz-handle", { userId }).then((response) => {
        if (!response) {
          throw new Error("Failed to remove business handle");
        }
        return response;
      }),
  };

  const MirrorNodeRestAPI = {
    getTokenInfo: (tokenId: string) => axios.get<TokenInfo>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/tokens/${tokenId}`),
    getBalancesForAccountId: (accountId: string) => axios.get<BalanceResponse>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/balances?account.id=${accountId}`),
  };

  const Transaction = {
    createTransactionBytes: (data: CreateTransactionByteBody): Promise<Uint8Array> =>
      requests.post<Uint8Array>("/api/transaction/create-topup-transaction", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to create transaction bytes");
        }
        return response;
      }),
    setTransactionAmount: (data: SetTransactionBody): Promise<TopUpResponse> =>
      requests.post<TopUpResponse>("/api/transaction/top-up", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to set transaction amount");
        }
        return response;
      }),
    reimburseAmount: (data: reimburseAmountBody): Promise<any> => requests.post("/api/transaction/reimbursement", { ...data }),
  };

  const Integrations = {
    twitterPersonalHandle: (): Promise<{ url: string }> =>
      requests.get<{ url: string }>("/api/integrations/twitter/personalHandle").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch twitter personal handle");
        }
        return response;
      }),
    twitterBizHandle: (): Promise<{ url: string }> =>
      requests.get<{ url: string }>("/api/integrations/twitter/bizHandle").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch twitter business handle");
        }
        return response;
      }),
  };

  const Campaign = {
    addCampaign: (data: addCampaignBody): Promise<any> => requests.post("/api/campaign/add-new", { ...data }),
    getCampaigns: (): Promise<CampaignCards[]> =>
      requests.get<CampaignCards[]>("/api/campaign/all").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch campaigns");
        }
        return response;
      }),
    updateCampaignStatus: (data: updateCampaignStatusBody): Promise<any> => requests.post("/api/campaign/update-status", { ...data }),
    chatResponse: (data: any): Promise<any> => requests.post("/api/campaign/chatgpt", data),
  };

  return { isLoading, User, Auth, Admin, MirrorNodeRestAPI, Transaction, Integrations, Campaign };
};
