import { useCallback, useContext } from "react";
import { HashconnectServiceContext } from "../ConnectionProvider/HashconnectServiceContext";
import useAuthenticationHelpers from "../authentication/useAuthenticationHelpers";

const useHandleAuthenticateWithHashconnect = () => {
  const { topic, pairingData, hashconnect } = useContext(HashconnectServiceContext);
  const { createChallenge, generateAuth, handleSuccess, handleError, authStatusLog, setAuthStatusLog, delay } = useAuthenticationHelpers();

  const authenticateWithHashconnect = async (topic: string, accountId: string, server: any, payload: any) => {
    return await hashconnect?.authenticate(topic, accountId, server.account, Buffer.from(server.signature), payload);
  };

  const handleAuthenticate = useCallback(async () => {
    try {
      const accountId = pairingData?.accountIds[0];
      if (!topic || !accountId) return;

      await delay(500);
      const { payload, server } = await createChallenge();

      await delay(500);
      const authResponse = await authenticateWithHashconnect(topic, accountId, server, payload);

      if (authResponse?.success && authResponse?.signedPayload && authResponse?.userSignature) {
        const authGenResponse = await generateAuth(authResponse, server, accountId);
        if (authGenResponse?.deviceId && authGenResponse?.ast) {
          return await handleSuccess(authGenResponse);
        }
      }

      if (authResponse?.error) {
        setAuthStatusLog((logs) => [...logs, { type: "error", message: `Error while signing: ${authResponse.error}` }]);
      }
    } catch (err) {
      handleError(err);
    }
  }, [createChallenge, generateAuth, handleSuccess, handleError, authenticateWithHashconnect, topic, pairingData?.accountIds, delay, setAuthStatusLog]);

  return { handleAuthenticate, authStatusLog };
};

export default useHandleAuthenticateWithHashconnect;
