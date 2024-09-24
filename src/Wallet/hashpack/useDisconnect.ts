import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import { useStore } from "../../Store/StoreProvider";
import { getErrorMessage } from "../../Utilities/helpers";
import { useHashconnectService } from "./useHashconnectServicce";

export const useDisconnect = () => {
  const { pairingData, hashconnect, setState } = useHashconnectService();
  const { Auth } = useApiInstance();
  const [_, , removeCookies] = useCookies(["aSToken"]);
  const store = useStore();

  const disconnect = useCallback(async () => {
    try {
      await hashconnect?.disconnect(pairingData?.topic!);
      setState && setState((exState) => ({ ...exState, pairingData: null }));
      const logoutResponse = await Auth.doLogout();
      removeCookies("aSToken");
      store.dispatch({ type: "RESET_STATE" });
      return logoutResponse;
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [Auth, hashconnect, pairingData?.topic, store]);

  return disconnect;
};
