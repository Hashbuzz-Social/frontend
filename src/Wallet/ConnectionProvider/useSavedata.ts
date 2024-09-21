import { useCallback, useContext } from "react";
import { HashconnectServiceContext } from "./HashconnectServiceContext";
import { SignClientTypes } from "@walletconnect/types";

const useSaveData = (metaData: SignClientTypes.Metadata) => {
  const { walletConnectState , dAppConnector} = useContext(HashconnectServiceContext);

  return useCallback(() => {
    localStorage.setItem(
      "hashbuzz-wc-state",
      JSON.stringify({
        projectId: dAppConnector?.projectId,
        name: metaData.name,
        description: metaData.description,
        url: "https://testnet.hashbuzz.social",
        icons: metaData.icons,
        message: walletConnectState?.message,
      })
    );
  }, [walletConnectState, metaData]);
};

export default useSaveData;