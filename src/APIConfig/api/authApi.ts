import { AdminLoginResponse, AuthCred, Challenge, GenerateAstPayload, GnerateReseponse, LogoutResponse, WCChallange, WCVerifyResponseBody } from "../../types";
import useDebounncedRequests from "../hooks/useDebouncedRequest";

export const useAuthApi = () => {
  const { isLoading, get, post } = useDebounncedRequests();

  const Auth = {
    refreshToken: (refreshToken: string): Promise<AuthCred | void | undefined> => post("/auth/refreshToken", { refreshToken }),
    doLogout: (): Promise<LogoutResponse> =>
      post<LogoutResponse>("/auth/logout", {}).then((response) => {
        if (!response) {
          throw new Error("Failed to logout");
        }
        return response;
      }),
    adminLogin: (data: { password: string }): Promise<AdminLoginResponse> =>
      post<AdminLoginResponse>("/auth/admin-login", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to login");
        }
        return response;
      }),
    authPing: (): Promise<{ wallet_id: string; status: string; device_id: string }> =>
      get<{ wallet_id: string; status: string; device_id: string }>("/auth/ping").then((response) => {
        if (!response) {
          throw new Error("Failed to fetch auth ping");
        }
        return response;
      }),
    hashconnect: {
      getHashconnectChallenge: (data: { url: string }): Promise<Challenge> =>
        get<Challenge>("/auth/hashconnect/create-challange", { ...data }).then((response) => {
          if (!response) {
            throw new Error("Failed to fetch hashconnect challenge");
          }
          return response;
        }),
      verifyHashconnectSign: (data: GenerateAstPayload): Promise<GnerateReseponse> =>
        post<GnerateReseponse>("/auth/hashconnect/verify-response", { ...data }).then((response) => {
          if (!response) {
            throw new Error("Failed to verify hashconnect sign");
          }
          return response;
        }),
    },
    walletConnect: {
      getWalletConnectChallenge: (): Promise<WCChallange> =>
        get<WCChallange>("/auth/walletconnect/create-challange").then((response) => {
          if (!response) {
            throw new Error("Failed to fetch wallet connect challenge");
          }
          return response;
        }),
      verifyWalletConnectSign: (data: WCVerifyResponseBody): Promise<GnerateReseponse> =>
        post<GnerateReseponse>("/auth/walletconnect/verify-response", { ...data }).then((response) => {
          if (!response) {
            throw new Error("Failed to verify wallet connect sign");
          }
          return response;
        }),
    },
  };

  return { isLoading, ...Auth };
};

export default useAuthApi;
