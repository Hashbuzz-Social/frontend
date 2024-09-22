import { DAppConnector, DAppSigner, ExtensionData } from "@hashgraph/hedera-wallet-connect";
import { SessionTypes } from "@walletconnect/types";
import { HashConnect, HashConnectTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/esm/types";
import React, { createContext, useEffect, useMemo, useReducer, useRef } from "react";
import { Networks } from "../../types";
import useHashConnect from "./useHashConnectConnector";
import useWalletConnectConnector from "./useWalletConnectConnector";

export interface HashconnectContextAPI {
  availableExtension: HashConnectTypes.WalletMetadata;
  state: HashConnectConnectionState;
  topic: string;
  pairingString: string;
  pairingData: HashConnectTypes.SavedPairingData | null;
  debug: boolean;
}

// WalletConnect State Definition
export interface WalletConnectState {
  sessions: SessionTypes.Struct[];
  signers: DAppSigner[];
  selectedSigner: DAppSigner | null;
  isLoading: boolean;
  message: string;
  extensions: ExtensionData[];
  modalState?: {
    status?: "Success" | "Error" | "Warning" | "Info";
    message?: string;
    isLoading?: boolean;
    data?: any;
  };
  pairedAccountid: string | null;
}

export interface HashconnectAPIProviderProps {
  children: React.ReactNode;
  network: Networks;
  metaData: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

// Initial State for WalletConnect
const initialWalletConnectState: WalletConnectState = {
  sessions: [],
  signers: [],
  selectedSigner: null,
  isLoading: false,
  message: "",
  extensions: [],
  pairedAccountid: null,
};

// WalletConnect Actions
export type WalletConnectAction =
  | { type: "SET_SESSIONS"; payload: SessionTypes.Struct[] }
  | { type: "SET_SIGNERS"; payload: DAppSigner[] }
  | { type: "SET_SELECTED_SIGNER"; payload: DAppSigner }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "SET_EXTENSIONS"; payload: ExtensionData[] }
  | { type: "SET_MODAL_STATE"; payload: WalletConnectState["modalState"] }
  | { type: "RESET_MODAL_STATE" }
  | { type: "SET_DISCONNECTED_STAE" }
  | { type: "SET_PAIRED_ACCOUNT"; payload: string }
  | { type: "UPDATE_MODAL_STATE"; payload: WalletConnectState["modalState"] };

// Create context
export const HashconnectServiceContext = createContext<
  Partial<
    HashconnectContextAPI & {
      network: Networks;
      hashconnect: HashConnect | null;
      dAppConnector: DAppConnector | null;
      walletConnectState: WalletConnectState;
      dispatch: React.Dispatch<WalletConnectAction>;
      setState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>;
      initWalletConnect: () => Promise<void>;
      setNewSession: (session: SessionTypes.Struct) => void;
    }
  >
>({
  walletConnectState: initialWalletConnectState,
});

// WalletConnect Reducer Function
const walletConnectReducer = (state: WalletConnectState, action: WalletConnectAction): WalletConnectState => {
  switch (action.type) {
    case "SET_SESSIONS":
      return { ...state, sessions: [...state.sessions, ...action.payload] };
    case "SET_SIGNERS":
      return { ...state, signers: [...state.signers, ...action.payload] };
    case "SET_SELECTED_SIGNER":
      return { ...state, selectedSigner: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_EXTENSIONS":
      return { ...state, extensions: action.payload };
    case "SET_MODAL_STATE":
      return { ...state, modalState: action.payload };
    case "RESET_MODAL_STATE":
      return { ...state, modalState: undefined };
    case "UPDATE_MODAL_STATE":
      return { ...state, modalState: { ...state.modalState, ...action.payload } };
    case "SET_PAIRED_ACCOUNT":
      return { ...state, pairedAccountid: action.payload };
    case "SET_DISCONNECTED_STAE":
      return { ...state, sessions: [], signers: [], selectedSigner: null, pairedAccountid: null };
    default:
      return state;
  }
};

// Main Provider Component

export const HashconnectAPIProvider = ({ children, metaData, network, debug }: HashconnectAPIProviderProps) => {
  const [state, setState] = React.useState<Partial<HashconnectContextAPI>>({});
  const [walletConnectState, dispatch] = useReducer(walletConnectReducer, initialWalletConnectState);
  const walletConnectorRef = useRef<DAppConnector | null>(null);
  const hashconnectRef = useRef<HashConnect | null>(null);

  const { initHashconnect } = useHashConnect(metaData, network, setState, hashconnectRef, debug);
  const { initWalletConnect, setNewSession } = useWalletConnectConnector({
    dispatch,
    metadata: {
      name: metaData.name,
      description: metaData.description,
      icons: [metaData.icon],
      url: "https://testnet.hashbuzz.social",
    },
    network,
    walletConnectorRef,
    debug,
  });

  useEffect(() => {
    initHashconnect().catch((error) => {
      debug && console.error("Failed to initialize Hashconnect:", error);
    });
    initWalletConnect().catch((error) => {
      console.error("Failed to initialize WalletConnect:", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      network,
      hashconnect: hashconnectRef.current,
      walletConnectState,
      dispatch,
      setState,
      debug,
      initWalletConnect,
      dAppConnector: walletConnectorRef.current,
      setNewSession: setNewSession,
    }),
    [state, network, hashconnectRef, walletConnectState, dispatch, setState, debug, initWalletConnect, walletConnectorRef, setNewSession]
  );

  return <HashconnectServiceContext.Provider value={value}>{children}</HashconnectServiceContext.Provider>;
};
