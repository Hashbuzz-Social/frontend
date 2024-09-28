import { useContext } from "react";
import { WalletConnectContext } from "../ConnectionProvider/WalletConnectProvider";

const useWalletConnectService = () => {
  const { dAppConnector, dispatch, walletConnectState, setNewSession } = useContext(WalletConnectContext);

  return { dAppConnector, dispatch, ...(walletConnectState && { ...walletConnectState }), setNewSession };
};

export default useWalletConnectService;
