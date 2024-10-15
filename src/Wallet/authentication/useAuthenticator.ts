import { SignMessageParams } from "@hashgraph/hedera-wallet-connect";
import useDisconnectHandler from "@wallet/hooks/useDisconnectHandler";
import useSession from "@wallet/hooks/useSessions";
import useAsyncStatusWrapper from "@wallet/services/useAsyncStatusWrapper";
import { useApiInstance } from "APIConfig/api";
import { useCallback } from "react";
import { useCookies } from "react-cookie";
import useAuthenticationHelpers from "./useAuthenticationHelpers";
import { useStore } from "@store/hooks";

const useAuthenticator = () => {
  // Session context to get the selected signer and network
  const { state, dAppConnector } = useSession();
  const { selectedSigner, network } = state || {};
  const { dispatch } = useStore();
  const [a, _, removeCookies] = useCookies(["aSToken", "refreshToken"]);
  const { disconnect } = useDisconnectHandler();
  const { modalWrapper } = useAsyncStatusWrapper();

  // helpers hooks menthods  to mannager authentication
  const { createChallenge, handleError, delay, verifySignature, handleSuccess } = useAuthenticationHelpers();

  // APIS calls 
  const { Auth } = useApiInstance();

  const handleSignMessage = useCallback(
    async (message: string) => {
      try {
        console.log("handleSignMessage", message);

        if (!selectedSigner) throw new Error("Selected signer is required");

        const acccountId = selectedSigner.getAccountId().toString();
        /** Sign Message Params */
        const params: SignMessageParams = {
          signerAccountId: `hedera:${network ?? "testnet"}:${acccountId}`,
          message,
        };
        const response = await dAppConnector!.signMessage(params);
        console.log("response", response);
        // const { signatureMap } = 
        //@ts-ignore
        const signatureMap = response.signatureMap;
        return { signatureMap, acccountId };
      } catch (err) {
        //@ts-ignore
        throw new Error(err);
      }
    },
    [dAppConnector, network, selectedSigner]
  );

  const initSignAndAutheticate = useCallback(async () => {
    try {
      const payload = await createChallenge();
      const { signatureMap, acccountId } = await handleSignMessage(JSON.stringify(payload));
      const authResponse = await verifySignature(acccountId, payload!, signatureMap);
      await handleSuccess(authResponse!);
    } catch (err) {
      handleError(err);
      console.log(err);
    }
  }, [createChallenge, delay, handleSignMessage, handleError]);

  const handleDisconnectAndLogout = useCallback(async () => {
    try {

      // Perform logout call
      const response = await Auth.doLogout();
      console.log('Logout response:', response);

      // Disconnect from walletConnect
      if (selectedSigner?.topic) {
        await modalWrapper(() => disconnect(selectedSigner.topic));
        console.log('Disconnected from walletConnect');
      } else {
        throw new Error('Selected signer topic is required');
      }

      // remove cookies
      removeCookies("aSToken");
      removeCookies("refreshToken");

      dispatch({ type: "RESET_STATE" });

      // Return boolean
      return true;
    } catch (error) {
      console.error('Error during disconnect and logout:', error);
      return false;
    }

  }, [dAppConnector, selectedSigner]);
  return { initSignAndAutheticate, handleDisconnectAndLogout };
};

export default useAuthenticator;
