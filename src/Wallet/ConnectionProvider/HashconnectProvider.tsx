import { HashConnect, HashConnectTypes } from "hashconnect";
import { HashConnectConnectionState as HashConnectConnectionStatuses } from "hashconnect/dist/esm/types";
import React, { createContext, useEffect, useMemo, useRef } from "react";
import { Networks } from "../../types";
import useHashConnect from "./useHashConnectConnector";

/** Hashconnect status update for the wallet */
export interface HashconnectState {
  availableExtension: HashConnectTypes.WalletMetadata;
  connectionStatus: HashConnectConnectionStatuses;
  topic: string;
  pairingString: string;
  pairingData: HashConnectTypes.SavedPairingData | null;
  debug: boolean;
}

export interface HashconnectAPIProviderProps {
  children: React.ReactNode;
  network: Networks;
  metaData: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

// Create context
export const HashconnectServiceContext = createContext<
  Partial<{
    /** Hashconnect states */
    hashconnectState: Partial<HashconnectState>;
    network: Networks;
    hashconnect: HashConnect | null;
    setState: React.Dispatch<React.SetStateAction<Partial<HashconnectState>>>;
    debug: boolean;
  }>
>({});

export const HashconnectAPIProvider = ({ children, metaData, network, debug }: HashconnectAPIProviderProps) => {
  const [state, setState] = React.useState<Partial<HashconnectState>>({});
  const hashconnectRef = useRef<HashConnect | null>(null);

  const { initHashconnect } = useHashConnect(metaData, network, setState, hashconnectRef, debug);
  useEffect(() => {
    initHashconnect().catch((error) => {
      debug && console.error("Failed to initialize Hashconnect:", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      network,
      hashconnect: hashconnectRef.current,
      hashconnectState: state,
      setState,
      debug,
    }),
    [network, hashconnectRef, setState, debug]
  );

  return <HashconnectServiceContext.Provider value={value}>{children}</HashconnectServiceContext.Provider>;
};
