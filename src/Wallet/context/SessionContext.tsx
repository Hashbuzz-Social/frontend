// src/contexts/SessionContext.tsx
import { DAppConnector, DAppSigner, ExtensionData } from "@hashgraph/hedera-wallet-connect";
import useWalletConnectService from "@wallet/services/useWalletConnectService";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import React, { createContext, Dispatch, ReactNode, useEffect, useReducer, useRef } from "react";
import { Networks } from "types";
import { getLastItem } from "utils/helpers";

// Define the shape of your session state
interface SessionState {
  sessions: SessionTypes.Struct[];
  signers: DAppSigner[];
  selectedSigner: DAppSigner | null;
  isLoading: boolean;
  extensions: ExtensionData[];
  network: Networks;
  error: string | null; // Add error field
}

// Define actions
export type Action =
  | { type: "SET_SESSIONS"; payload: SessionTypes.Struct[] }
  | { type: "ADD_SESSION"; payload: SessionTypes.Struct }
  | { type: "SET_SIGNERS"; payload: DAppSigner[] }
  | { type: "SET_SELECTED_SIGNER"; payload: DAppSigner | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_EXTENSIONS"; payload: ExtensionData[] }
  | { type: "RESET_SESSION" }
  | { type: "SET_NETWORK"; payload: Networks }
  | { type: "SET_ERROR"; payload: string } // Add SET_ERROR action
  | { type: "CLEAR_ERROR" }
  | { type: "DISCONNECT"; payload: { topic?: string } };
// Initial state
const initialState: SessionState = {
  sessions: [],
  signers: [],
  selectedSigner: null,
  isLoading: false,
  extensions: [],
  network: "testnet",
  error: null, // Add error field
};

// Reducer function
const sessionReducer = (state: SessionState, action: Action): SessionState => {
  switch (action.type) {
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "ADD_SESSION":
      return { ...state, sessions: [...state.sessions, action.payload] };
    case "SET_SIGNERS":
      return { ...state, signers: action.payload };
    case "SET_SELECTED_SIGNER":
      return { ...state, selectedSigner: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_EXTENSIONS":
      return { ...state, extensions: action.payload };
    case "RESET_SESSION":
      return initialState;
    case "SET_NETWORK":
      return { ...state, network: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "DISCONNECT":
      if (action.payload.topic) {
        return {
          ...state,
          sessions: state.sessions.filter((session) => session.topic !== action.payload.topic),
          signers: state.signers.filter((signer) => signer.topic !== action.payload.topic),
          selectedSigner: state.selectedSigner?.topic === action.payload.topic ? null : getLastItem(state.signers) ?? null,
        };
      }
      return {
        ...state,
        sessions: [],
        signers: [],
        selectedSigner: null,
      };
    default:
      return state;
  }
};

// Create context
interface SessionContextProps {
  state: SessionState;
  dispatch: Dispatch<Action>;
  dAppConnector: DAppConnector | null;
}

export const SessionContext = createContext<SessionContextProps | undefined>(undefined);

// Provider component
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, JSON.parse(JSON.stringify(initialState)));
  const dAppConnectorRef = useRef<DAppConnector | null>(null);
  const { initializeConnector } = useWalletConnectService(dAppConnectorRef, dispatch);

  const handdleSessionDelete = (arg: SignClientTypes.EventArguments["session_delete"]) => {
    const { topic } = arg;
    dispatch({ type: "DISCONNECT", payload: { topic } });
  };

  // Set device id to the cookies.

  // Wallet event handlers.
  useEffect(() => {
    dAppConnectorRef.current?.walletConnectClient?.on("session_delete", handdleSessionDelete);
    return () => {
      dAppConnectorRef.current?.walletConnectClient?.off("session_delete", handdleSessionDelete);
    };
  }, []);

  useEffect(() => {
    initializeConnector()
      .catch((error) => {
        dispatch({ type: "SET_ERROR", payload: error.message });
        console.error("Error while initiating dAppConnector", error);
      })
      .finally(() => {
        console.info("dAppConnector initialized successfully");
      });
  }, []);

  return <SessionContext.Provider value={{ state, dispatch, dAppConnector: dAppConnectorRef.current }}>{children}</SessionContext.Provider>;
};
