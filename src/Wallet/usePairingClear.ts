import { useContext } from "react";
import { HashconnectServiceContext } from "./ConnectionProvider/HashconnectServiceContext";

export const usePairingClear = () => {
  const { hashconnect } = useContext(HashconnectServiceContext);

  const clearPairings = () => {
    hashconnect?.clearConnectionsAndData();
    // setState!((exState) => ({ ...exState, pairingData: null }));
  };

  return clearPairings;
};
