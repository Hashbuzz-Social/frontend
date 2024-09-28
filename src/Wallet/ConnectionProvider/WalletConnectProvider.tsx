import { DAppConnector, DAppSigner, ExtensionData } from "@hashgraph/hedera-wallet-connect";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import React, { createContext, useEffect, useMemo, useReducer, useRef } from "react";
import { Networks } from "../../types";
import useWalletConnectConnector from "./useWalletConnectConnector";

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

// Create context
export const WalletConnectContext = createContext<
  Partial<{
    network: Networks;
    dAppConnector: DAppConnector | null;
    walletConnectState: WalletConnectState;
    dispatch: React.Dispatch<WalletConnectAction>;
    setNewSession: (session: SessionTypes.Struct) => void;
  }>
>({
  walletConnectState: initialWalletConnectState,
});

export interface WalletConnectProviedrProps {
  network: Networks;
  metadata: SignClientTypes.Metadata;
  debug?: boolean;
}

const WalletConnectProvider: React.FC<WalletConnectProviedrProps> = ({ children, metadata, network, debug }) => {
  const [state, dispatch] = useReducer(walletConnectReducer, initialWalletConnectState);
  const walletConnectorRef = useRef<DAppConnector | null>(null);

  const { initWalletConnect, setNewSession } = useWalletConnectConnector({
    dispatch,
    metadata,
    network,
    walletConnectorRef,
    debug,
  });

  useEffect(() => {
    initWalletConnect().catch((error) => {
      console.error("Failed to initialize WalletConnect:", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      network,
      dAppConnector: walletConnectorRef.current,
      walletConnectState: state,
      dispatch,
      initWalletConnect,
      setNewSession,
    }),
    [state, network]
  );

  return <WalletConnectContext.Provider value={value}>{children}</WalletConnectContext.Provider>;
};

export default WalletConnectProvider;
