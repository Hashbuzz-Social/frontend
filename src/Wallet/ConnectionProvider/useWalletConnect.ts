import { DAppConnector, HederaJsonRpcMethod } from "@hashgraph/hedera-wallet-connect";
import { LedgerId } from "@hashgraph/sdk";
import { SignClientTypes } from "@walletconnect/types";
import React, { useCallback, useEffect, useRef } from "react";
import { Networks } from "../../types";
import { WalletConnectAction } from "./HashconnectServiceContext";

const projectId = process.env.REACT_APP_PROJECT_ID || "";

// Ledger Mapping for Networks
const NETWORKS_LEDGERS: { [key in Networks]: LedgerId } = {
  testnet: LedgerId.TESTNET,
  mainnet: LedgerId.MAINNET,
  previewnet: LedgerId.PREVIEWNET,
};

const useWalletConnect = (dispatch: React.Dispatch<WalletConnectAction>, metadata: SignClientTypes.Metadata, network: Networks, debug?: boolean) => {
  const walletConnectorRef = useRef<DAppConnector | null>(null);

  const initWalletConnect = useCallback(async () => {
    if (!walletConnectorRef.current) {
      walletConnectorRef.current = new DAppConnector({...metadata}, NETWORKS_LEDGERS[network], projectId, Object.values(HederaJsonRpcMethod));
      dispatch({ type: "SET_CONNECTOR", payload: walletConnectorRef.current });
    }

    const walletConnector = walletConnectorRef.current;
    await walletConnector.init({ logger: "debug" });

    dispatch({ type: "SET_EXTENSIONS", payload: walletConnector.extensions });
    dispatch({ type: "SET_SESSIONS", payload: walletConnector.walletConnectClient?.session.getAll() || [] });

    walletConnector.onSessionIframeCreated = (session) => {
      debug && console.log("Session iframe created:", session);
    };
  }, [dispatch, metadata, network, debug]);

  useEffect(() => {
    initWalletConnect().catch((error) => {
      console.error("Failed to initialize WalletConnect:", error);
    });
  }, [initWalletConnect]);

  return { initWalletConnect, walletConnectorRef };
};

export default useWalletConnect;
