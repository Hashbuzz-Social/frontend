// src/services/walletConnectService.ts
import { DAppConnector, HederaChainId, HederaJsonRpcMethod, HederaSessionEvent } from "@hashgraph/hedera-wallet-connect";
import { LedgerId } from "@hashgraph/sdk";
import { SessionContext, Action } from "@wallet/context/SessionContext";
import { SignClientTypes } from "@walletconnect/types";
import React, { useCallback, useContext } from "react";
import { Networks } from "../../types";
import useConnector from "../hooks/useConnector";
import { getLastItem } from "utils/helpers";

const projectNetWork = process.env.REACT_APP_NETWORK as Networks;

// Ledger Mapping for Networks
const NETWORKS_LEDGERS: { [key in Networks]: LedgerId } = {
  testnet: LedgerId.TESTNET,
  mainnet: LedgerId.MAINNET,
  previewnet: LedgerId.PREVIEWNET,
};

export const useWalletConnectService = (dAppConnectorRef: React.MutableRefObject<DAppConnector | null>, dispatch: React.Dispatch<Action>) => {
  const { projectId, name, description, url, icons } = useConnector();
  const metadata: SignClientTypes.Metadata = {
    name,
    description,
    url,
    icons,
  };

  const wrapWithErrorHandling = (method: Function) => {
    return async (...args: any[]) => {
      try {
        return await method(...args);
      } catch (error: any) {
        dispatch && dispatch({ type: "SET_ERROR", payload: error.message });
        throw error; // Re-throw the error if needed
      }
    };
  };

  const initializeConnector = useCallback(async () => {
    try {
      if (!dispatch || !dAppConnectorRef) {
        throw new Error("dispatch or dAppConnectorRef is not provided");
      };

      const dAppConnector = new DAppConnector(metadata, NETWORKS_LEDGERS[projectNetWork], projectId, Object.values(HederaJsonRpcMethod), [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged], [HederaChainId.Testnet, HederaChainId.Mainnet, HederaChainId.Previewnet]);

      // Wrap methods with error handling
      dAppConnector.init = wrapWithErrorHandling(dAppConnector.init.bind(dAppConnector));
      dAppConnector.signMessage = wrapWithErrorHandling(dAppConnector.signMessage.bind(dAppConnector));
      dAppConnector.signTransaction = wrapWithErrorHandling(dAppConnector.signTransaction.bind(dAppConnector));
      dAppConnector.signAndExecuteTransaction = wrapWithErrorHandling(dAppConnector.signAndExecuteTransaction.bind(dAppConnector));
      dAppConnector.openModal = wrapWithErrorHandling(dAppConnector.openModal.bind(dAppConnector));
      dAppConnector.connectQR = wrapWithErrorHandling(dAppConnector.connectQR.bind(dAppConnector));
      dAppConnector.connect = wrapWithErrorHandling(dAppConnector.connect.bind(dAppConnector));
      dAppConnector.disconnect = wrapWithErrorHandling(dAppConnector.disconnect.bind(dAppConnector));
      dAppConnector.disconnectAll = wrapWithErrorHandling(dAppConnector.disconnectAll.bind(dAppConnector));
      dAppConnector.connectExtension = wrapWithErrorHandling(dAppConnector.connectExtension.bind(dAppConnector));
      // Add other methods as needed

      await dAppConnector.init({ logger: "error" });

      dAppConnector.onSessionIframeCreated = (session) => {
        try {
          dispatch({ type: "ADD_SESSION", payload: session });
        } catch (err) {
          console.log(err);
        }
      };

      const availableExtensions = dAppConnector.extensions?.filter((extension) => extension.available) || [];
      dispatch({ type: "SET_EXTENSIONS", payload: availableExtensions });

      dAppConnectorRef.current = dAppConnector;
      const signers = dAppConnector.signers;

      dispatch({ type: "SET_SIGNERS", payload: signers });
      dispatch({ type: "SET_SELECTED_SIGNER", payload: getLastItem(signers) ?? null });
      dispatch({ type: "SET_NETWORK", payload: projectNetWork });

      const existingSessions = dAppConnector.walletConnectClient?.session.getAll() || [];
      if (existingSessions.length > 0) {
        dispatch({ type: "SET_SESSIONS", payload: existingSessions });
      }

    } catch (error: any) {
      dispatch && dispatch({ type: "SET_ERROR", payload: error.message });
      console.log(error);
    }
  }, [dispatch, dAppConnectorRef, metadata, projectId]);

  return { initializeConnector };
};

export default useWalletConnectService;
