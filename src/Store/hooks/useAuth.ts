import debounce from "lodash/debounce";
import { useCallback } from "react";
import { useApiInstance } from "../../APIConfig/api";
import { useStore } from "./useStore";
import useSession from "@wallet/hooks/useSessions";

export const useAuth = () => {
  const { dispatch } = useStore();
  const { Auth, isLoading } = useApiInstance();
  const { state } = useSession();

  const connectedWalletId = state?.selectedSigner?.getAccountId().toString();

  const authCheckPing = useCallback(async () => {
    try {
      const data = await Auth.authPing();
      if (data.wallet_id && data.wallet_id === connectedWalletId) {
        dispatch({ type: "SET_PING", payload: { status: true, hedera_wallet_id: data.wallet_id } });
      }
      return { ping: true };
    } catch (err) {
      dispatch({ type: "RESET_STATE" });
      return { ping: false };
    }
  }, [Auth, dispatch, state]);

  const debouncedAuthCheckPing = useCallback(debounce(authCheckPing, 2000), [authCheckPing]);

  return {
    authCheckPing: debouncedAuthCheckPing,
    isLoading,
  };
};

export default useAuth;
