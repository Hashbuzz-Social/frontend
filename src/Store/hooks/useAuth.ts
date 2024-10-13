import debounce from "lodash/debounce";
import { useCallback } from "react";
import { useApiInstance } from "../../APIConfig/api";
import { useStore } from "./useStore";

export const useAuth = () => {
  const { dispatch } = useStore();
  const { Auth, User, isLoading } = useApiInstance();

  const authCheckPing = useCallback(async () => {
    try {
      const pingResponse = await Auth.authPing();
      const data = pingResponse.data;
      const status = pingResponse.status;

      if (data && status === "success" && data.hedera_wallet_id) {
        const currentUser = await User.getCurrentUser();
        dispatch({ type: "UPDATE_CURRENT_USER", payload: currentUser });
        dispatch({ type: "SET_PING", payload: { status: true, hedera_wallet_id: data.hedera_wallet_id } });
      }
      return { ping: true };
    } catch (err) {
      dispatch({ type: "RESET_STATE" });
      return { ping: false };
    } finally {
      dispatch({ type: "HIDE_SPLASH_SCREEN" });
    }
  }, [Auth, , dispatch]);

  const debouncedAuthCheckPing = useCallback(debounce(authCheckPing, 2000), [authCheckPing]);

  return {
    authCheckPing: debouncedAuthCheckPing,
    isLoading,
  };
};

export default useAuth;
