import { SignMessageParams } from "@hashgraph/hedera-wallet-connect";
import useSession from "@wallet/hooks/useSessions";
import { useCallback } from "react";
import useAuthenticationHelpers from "./useAuthenticationHelpers";

const useAuthenticator = () => {
  const { state, dAppConnector } = useSession();
  const { selectedSigner, network } = state || {};
  const { createChallenge, handleError, delay, verifySignature, handleSuccess } = useAuthenticationHelpers();

  const handleSignMessage = useCallback(
    async (message: string) => {
      console.log("handleSignMessage", message);

      if (!selectedSigner) throw new Error("Selected signer is required");

      const acccountId = selectedSigner.getAccountId().toString();
      /** Sign Message Params */
      const params: SignMessageParams = {
        signerAccountId: `hedera:${network ?? "testnet"}:${acccountId}`,
        message,
      };
      // @ts-ignore
      const { signatureMap } = await dAppConnector!.signMessage(params);
      return { signatureMap, acccountId };
    },
    [dAppConnector, network, selectedSigner]
  );

  const initSignAndAutheticate = useCallback(async () => {
    try {
      const payload = await createChallenge();
      const { signatureMap, acccountId } = await handleSignMessage(JSON.stringify(payload));
      const authResponse = await verifySignature(acccountId, payload!, signatureMap);
      handleSuccess(authResponse!);
    } catch (err) {
      handleError(err);
      console.log(err);
    }
  }, [createChallenge, delay, handleSignMessage, handleError]);

  return { initSignAndAutheticate };
};

export default useAuthenticator;
