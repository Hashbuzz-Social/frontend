import { useContext, useMemo } from "react";
import { HashconnectServiceContext } from "../ConnectionProvider/HashconnectServiceContext";

const useWalletConnectService = () => {
  const { dAppConnector, dispatch, walletConnectState } = useContext(HashconnectServiceContext);

  return { dAppConnector, dispatch, ...(walletConnectState && { ...walletConnectState }) };
};

export default useWalletConnectService;
