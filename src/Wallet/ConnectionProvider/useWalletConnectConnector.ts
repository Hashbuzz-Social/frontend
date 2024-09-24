import { DAppConnector, HederaJsonRpcMethod } from "@hashgraph/hedera-wallet-connect";
import { AccountId, LedgerId } from "@hashgraph/sdk";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import React, { useCallback } from "react";
import { Networks } from "../../types";
import { WalletConnectAction } from "./HashconnectServiceContext";
import useSaveData from "./useSavedata";

const projectId = process.env.REACT_APP_PROJECT_ID || "";

interface Props {
  dispatch: React.Dispatch<WalletConnectAction>;
  metadata: SignClientTypes.Metadata;
  network: Networks;
  walletConnectorRef: React.MutableRefObject<DAppConnector | null>;
  debug?: boolean;
}

// Ledger Mapping for Networks
const NETWORKS_LEDGERS: { [key in Networks]: LedgerId } = {
  testnet: LedgerId.TESTNET,
  mainnet: LedgerId.MAINNET,
  previewnet: LedgerId.PREVIEWNET,
};

const useWalletConnectConnector = ({ dispatch, metadata, network, walletConnectorRef, debug }: Props) => {
  debug = !!debug;
  const saveData = useSaveData(metadata);

  /**
   * Sets a new session and updates the state.
   * @param {SessionTypes.Struct} session - The session object.
   */
  const setNewSession = useCallback(
    (session: SessionTypes.Struct) => {
      dispatch({ type: "SET_SESSIONS", payload: [session] });
      const sessionAccount = session?.namespaces?.hedera?.accounts?.[0];
      const accountId = sessionAccount?.split(":").pop();

      accountId && dispatch && dispatch({ type: "SET_PAIRED_ACCOUNT", payload: accountId });

      !!debug && console.log("Session Account: ", { sessionAccount, accountId });

      if (!accountId) {
        console.error("No account id found in the session");
      } else {
        const signer = walletConnectorRef.current?.getSigner(AccountId.fromString(accountId));
        !!debug && console.log("SessionSigner: ", signer);
        !!signer && dispatch({ type: "SET_SELECTED_SIGNER", payload: signer });
      }
      !!debug && console.log("New connected session: ", session);
      !!debug && console.log("New connected accounts: ", session.namespaces?.hedera?.accounts);
    },
    [debug, dispatch, walletConnectorRef]
  );

  /**
   * Initiates the WalletConnect connection.
   */
  const initWalletConnect = useCallback(async () => {
    debug && console.log("walletConnect::Initiating Wallet Connect");
    if (!walletConnectorRef.current) {
      debug && console.log("walletConnect::Creating new Wallet Connect");
      walletConnectorRef.current = new DAppConnector({ ...metadata }, NETWORKS_LEDGERS[network], projectId, Object.values(HederaJsonRpcMethod));
    }
    await walletConnectorRef.current.init({ logger: "error" });
    walletConnectorRef.current.onSessionIframeCreated = (session) => {
      debug && console.log("walletConnect::Session iframe created: ", session);
      !!session && setNewSession(session);
    };

    walletConnectorRef.current.extensions.forEach((extension) => {
      debug && console.log("walletConnect::Extension: ", extension);
    });

    const avilableExtesniosn = walletConnectorRef.current.extensions.filter((extension) => extension.available);

    if (avilableExtesniosn && avilableExtesniosn.length > 0) {
      dispatch({ type: "SET_EXTENSIONS", payload: avilableExtesniosn });
    }

    // set connector again

    // set signers;
    const signers = walletConnectorRef.current.signers;
    dispatch({ type: "SET_SIGNERS", payload: signers });

    // set selected signer
    const selectedSigner = signers[0];
    dispatch({ type: "SET_SELECTED_SIGNER", payload: selectedSigner });

    // set sessions
    const sessions = walletConnectorRef.current.walletConnectClient?.session.getAll() || [];
    dispatch({ type: "SET_SESSIONS", payload: sessions });
    saveData();
  }, [debug, dispatch, metadata, network, saveData, setNewSession, walletConnectorRef]);

  return { initWalletConnect, walletConnectorRef, setNewSession };
};

export default useWalletConnectConnector;
