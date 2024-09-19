import { DAppConnector, DAppSigner, ExtensionData } from "@hashgraph/hedera-wallet-connect";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { HashConnect, HashConnectTypes } from "hashconnect";
import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { HashConnectConnectionState } from "hashconnect/dist/esm/types";
import { Networks, WalletConnectors } from "../../types";
import { useStore } from "../../Store/StoreProvider";
import useHashConnect from "./useHashConnect";
import useWalletConnect from "./useWalletConnect";

export interface HashconnectContextAPI {
  availableExtension: HashConnectTypes.WalletMetadata;
  state: HashConnectConnectionState;
  topic: string;
  pairingString: string;
  pairingData: HashConnectTypes.SavedPairingData | null;
}

// WalletConnect State Definition
export interface WalletConnectState {
  dAppConnector: DAppConnector | null;
  sessions: SessionTypes.Struct[];
  signers: DAppSigner[];
  selectedSigner: DAppSigner | null;
  isLoading: boolean;
  message: string;
  extensions: ExtensionData[];
}

export interface HashconnectAPIProviderProps {
  children: React.ReactNode;
  network: Networks;
  metaData: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

// WalletConnect Actions
export type WalletConnectAction = { type: "SET_CONNECTOR"; payload: DAppConnector } | { type: "SET_SESSIONS"; payload: SessionTypes.Struct[] } | { type: "SET_SIGNERS"; payload: DAppSigner[] } | { type: "SET_LOADING"; payload: boolean } | { type: "SET_MESSAGE"; payload: string } | { type: "SET_EXTENSIONS"; payload: ExtensionData[] };

// Create context
export const HashconnectServiceContext = createContext<
  Partial<
    HashconnectContextAPI & {
      network: Networks;
      hashconnect: HashConnect | null;
      walletConnectState: WalletConnectState;
      dispatch: React.Dispatch<WalletConnectAction>;
      setState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>
    }
  >
>({});

// Initial State for WalletConnect
const initialWalletConnectState: WalletConnectState = {
  dAppConnector: null,
  sessions: [],
  signers: [],
  selectedSigner: null,
  isLoading: false,
  message: "",
  extensions: [],
};

// WalletConnect Reducer Function
const walletConnectReducer = (state: WalletConnectState, action: WalletConnectAction): WalletConnectState => {
  switch (action.type) {
    case "SET_CONNECTOR":
      return { ...state, dAppConnector: action.payload };
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "SET_SIGNERS":
      return { ...state, signers: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_EXTENSIONS":
      return { ...state, extensions: action.payload };
    default:
      return state;
  }
};

// Main Provider Component

export const HashconnectAPIProvider = ({ children, metaData, network, debug }: HashconnectAPIProviderProps) => {
  const { walletConnector } = useStore();
  const [state, setState] = React.useState<Partial<HashconnectContextAPI>>({});
  const [walletConnectState, dispatch] = useReducer(walletConnectReducer, initialWalletConnectState);

  const { initHashconnect, hashconnectRef } = useHashConnect(metaData, network, setState, debug);
  const { initWalletConnect } = useWalletConnect(dispatch, {
    name: metaData.name,
    description: metaData.description,
    icons: [metaData.icon],
    url: "https://testnet.hashbuzz.social",
  }, network, debug);

  useEffect(() => {
    if (walletConnector === WalletConnectors.HashPack) {
      initHashconnect().catch((error) => {
        debug && console.error("Failed to initialize Hashconnect:", error);
      });
    }
  }, [initHashconnect, walletConnector]);

  /** Walletconnect Effects to watch */
  React.useEffect(() => {
    if (walletConnector === WalletConnectors.WalletConnect) {
      // Initialize WalletConnect
      initWalletConnect().catch((error) => {
        console.error("Failed to initialize WalletConnect:", error);
      });
    }
  }, [initWalletConnect, walletConnector]);

  const value = useMemo(
    () => ({
      ...state,
      network,
      hashconnect: hashconnectRef.current,
      walletConnectState,
      dispatch,
      setState
    }),
    [network, state, walletConnectState , setState]
  );

  return <HashconnectServiceContext.Provider value={value}>{children}</HashconnectServiceContext.Provider>;
};
