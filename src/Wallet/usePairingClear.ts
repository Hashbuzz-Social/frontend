import { useContext } from "react";
import { HashconnectServiceContext } from "./ConnectionProvider/HashconnectServiceContext";

export const usePairingClear = () => {
  const { hashconnect , setState} = useContext(HashconnectServiceContext);

  const clearPairings = () => {
    hashconnect?.clearConnectionsAndData();
    setState && setState((exState) => ({ ...exState, pairingData: null })); 
  };

  return clearPairings;
};
