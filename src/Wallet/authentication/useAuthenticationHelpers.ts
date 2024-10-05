import { useCallback, useState } from "react";
import { useApiInstance } from "../../APIConfig/api";
import { useCookies } from "react-cookie";
import { useAuth } from "../../Store/useAuth";
import { toast } from "react-toastify";
import { useStore } from "../../Store/StoreProvider";
import { GnerateReseponse, WCPayload } from "types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AuthenticationLog {
  type: "error" | "info" | "success";
  message: string;
}

const useAuthenticationHelpers = () => {
  const { Auth, MirrorNodeRestAPI } = useApiInstance();
  const [_, setCookies, removeCookie] = useCookies(["aSToken", "refreshToken"]);
  const { authCheckPing } = useAuth();
  const [authStatusLog, setAuthStatusLog] = useState<AuthenticationLog[]>([{ type: "info", message: "Authentication Called" }]);
  const { dispatch } = useStore();

  const createChallenge = async () => {
    try {
      const challange = await Auth.walletConnect.getWalletConnectChallenge();
      return challange.payload;
    } catch (errr) {
      console.log(errr);
    }
  };

  const verifySignature = async (accountId: string, signingPayload: WCPayload, userSignature: any) => {
    try {
      const verufyRequest = await Auth.walletConnect.verifyWalletConnectSign({
        originalPayload: signingPayload,
        signature: userSignature,
        signingAccount: accountId,
      });
      return verufyRequest;
    } catch (err) {
      console.log(err);
    }
  };

  const getAccoutPubKey = async (accountId: string) => {
    // Get the account public key
    try {
      const accounIfoRequest = await MirrorNodeRestAPI.getAccoutnInfo(accountId);
      const acountInfo = accounIfoRequest.data;
      //@ts-ignore
      const accountPublicKey = acountInfo.key.key;
      return accountPublicKey;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSuccess = useCallback(
    async (authGenResponse: GnerateReseponse) => {
      const { refreshToken, deviceId, ast, message } = authGenResponse;

      localStorage.setItem("device_id", deviceId);
      setCookies("aSToken", ast, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: false,
        maxAge: 24 * 60 * 60,
      });
      setCookies("refreshToken", refreshToken, { sameSite: false });
      setAuthStatusLog((logs) => [...logs, { type: "success", message: "Authentication Completed." }]);
      dispatch({ type: "SET_AUTH_CRED", payload: authGenResponse });

      await delay(500);
      await authCheckPing();
      toast.info(message ?? "Login Successful");

      return { auth: true, ast };
    },
    [dispatch, setCookies, authCheckPing]
  );

  const handleError = (error: any) => {
    removeCookie("refreshToken");
    localStorage.clear();
    removeCookie("aSToken");
    setAuthStatusLog((logs) => [...logs, { type: "error", message: `Error while Authenticating: ${error.message}` }]);
  };

  return {
    createChallenge,
    verifySignature,
    handleSuccess,
    handleError,
    authStatusLog,
    setAuthStatusLog,
    getAccoutPubKey,
    delay,
  };
};

export default useAuthenticationHelpers;
