import { useHashconnectService } from "./useHashconnectServicce";

export const usePairingClear = () => {
  const { hashconnect, setState } = useHashconnectService();

  const clearPairings = () => {
    hashconnect?.clearConnectionsAndData();
    setState && setState((exState) => ({ ...exState, pairingData: null }));
  };

  return clearPairings;
};
