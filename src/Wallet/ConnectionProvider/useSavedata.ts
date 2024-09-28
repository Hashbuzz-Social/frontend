import { useCallback, useContext } from "react";
import { HashconnectServiceContext } from "./HashconnectProvider";
import { SignClientTypes } from "@walletconnect/types";
import useWalletConnectService from "../walletConnect/useWalletConnectService";

const useSaveData = (metaData: SignClientTypes.Metadata) => {
  const { message, dAppConnector } = useWalletConnectService();

  return useCallback(() => {
    localStorage.setItem(
      "hashbuzz-wc-state",
      JSON.stringify({
        projectId: dAppConnector?.projectId,
        name: metaData.name,
        description: metaData.description,
        url: "https://testnet.hashbuzz.social",
        icons: metaData.icons,
        message: message,
      })
    );
  }, [dAppConnector, metaData, message]);
};

export default useSaveData;
