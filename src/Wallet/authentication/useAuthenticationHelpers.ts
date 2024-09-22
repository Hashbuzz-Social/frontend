import { useState } from "react";
import { useApiInstance } from "../../APIConfig/api";
import { useCookies } from "react-cookie";
import { useAuth } from "../../Store/useAuth";
import { toast } from "react-toastify";
import { useStore } from "../../Store/StoreProvider";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AuthenticationLog {
  type: "error" | "info" | "success";
  message: string;
}

const useAuthenticationHelpers = () => {
  const { Auth } = useApiInstance();
  const [_, setCookies, removeCookie] = useCookies(["aSToken", "refreshToken"]);
  const { authCheckPing } = useAuth();
  const [authStatusLog, setAuthStatusLog] = useState<AuthenticationLog[]>([{ type: "info", message: "Authentication Called" }]);
  const { dispatch } = useStore();

  const createChallenge = async () => {
    const { payload, server } = await Auth.createChallenge({ url: window.location.origin });
    return { payload, server };
  };

  const generateAuth = async (authResponse: any, server: any, accountId: string) => {
    const { signedPayload, userSignature } = authResponse;
    return await Auth.generateAuth({
      payload: signedPayload?.originalPayload,
      clientPayload: signedPayload,
      signatures: {
        server: server.signature,
        wallet: {
          accountId,
          value: Buffer.from(userSignature).toString("base64"),
        },
      },
    });
  };

  const handleSuccess = async (authGenResponse: any) => {
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
  };

  const handleError = (error: any) => {
    removeCookie("refreshToken");
    localStorage.clear();
    removeCookie("aSToken");
    setAuthStatusLog((logs) => [...logs, { type: "error", message: `Error while Authenticating: ${error.message}` }]);
  };

  return {
    createChallenge,
    generateAuth,
    handleSuccess,
    handleError,
    authStatusLog,
    setAuthStatusLog,
    delay,
  };
};


export default useAuthenticationHelpers;