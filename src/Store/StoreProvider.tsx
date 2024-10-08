import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { AppState, ContractInfo, EntityBalances, CurrentUser, AuthCred, WalletConnectors } from "../types";

interface StoreContextType extends AppState {
  dispatch: Dispatch<Action>;
}

const INITIAL_STATE: AppState = {
  ping: {
    status: false,
    hedera_wallet_id: "",
  },
  checkRefresh: false,
  balances: [],
  toasts: [],
  walletConnector: WalletConnectors.WalletConnect,
  auth: {
    ast: "",
    auth: false,
    deviceId: "",
    message: "",
    refreshToken: "",
  },
};

type Action = { type: "SET_PING"; payload: { status: boolean; hedera_wallet_id: string } } | { type: "UPDATE_STATE"; payload: Partial<AppState> } | { type: "SET_BALANCES"; payload: EntityBalances[] } | { type: "ADD_TOAST"; payload: { type: "success" | "error"; message: string } } | { type: "RESET_TOAST" } | { type: "RESET_STATE" } | { type: "SET_CONTRACT_INFO"; payload: ContractInfo } | { type: "UPDATE_CURRENT_USER"; payload: CurrentUser } | { type: "SET_AUTH_CRED", payload: AuthCred } | { type: "SET_WALLET_CONNECTOR", payload: WalletConnectors };

const storeReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_PING":
      return {
        ...state,
        ping: { ...action.payload },
        checkRefresh: true,
      };
    case "UPDATE_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_BALANCES":
      return {
        ...state,
        balances: action.payload,
      };
    case "SET_AUTH_CRED":
      return {
        ...state,
        auth: action.payload
      }
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "RESET_TOAST":
      return {
        ...state,
        toasts: [],
      };
    case "SET_CONTRACT_INFO":
      return {
        ...state,
        contractInfo: action.payload,
      };
    case "UPDATE_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "RESET_STATE":
      return JSON.parse(JSON.stringify(INITIAL_STATE));

    case "SET_WALLET_CONNECTOR":
      return {
        ...state,
        walletConnector: action.payload,
      };
    default:
      return state;
  }
};

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, JSON.parse(JSON.stringify(INITIAL_STATE)));

  return <StoreContext.Provider value={{ ...state, dispatch }}>{children}</StoreContext.Provider>;
};

