import { useCallback, useContext } from "react";
import { SessionTypes } from "@walletconnect/types";
import { AccountId } from "@hashgraph/sdk";
import { HashconnectServiceContext } from "../ConnectionProvider/HashconnectServiceContext";
import useModalWrapper from "./useModalWrapper";

/**
 * Custom hook to handle WalletConnect functionality.
 * @returns {Object} - An object containing handleConnect and handleDisconnectSessions functions.
 */
const useConnectViaWalletConnect = () => {
  const { walletConnectState, dispatch, debug, initWalletConnect } = useContext(HashconnectServiceContext);
  const { dAppConnector } = walletConnectState!;
  const { modalWrapper } = useModalWrapper();

  /**
   * Handles the connection via WalletConnect.
   * @param {string} [extensionId] - Optional extension ID to connect.
   * @throws Will throw an error if dAppConnector is not available.
   */
  const handleConnect = async (extensionId?: string) => {
    try {
      if (!dAppConnector) {
        debug && console.log("Connector is not initialized , initilizing it.");
        await initWalletConnect!();
      }
      let session: SessionTypes.Struct;

      // Set loading state
      dispatch && dispatch({ type: "SET_LOADING", payload: true });

      if (extensionId) {
        session = await dAppConnector?.connectExtension(extensionId)!;
      } else {
        session = await dAppConnector?.openModal()!;
      }

      setNewSession(session);
    } finally {
      // Reset loading state
      dispatch && dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  /**
   * Sets a new session and updates the state.
   * @param {SessionTypes.Struct} session - The session object.
   */
  const setNewSession = (session: SessionTypes.Struct) => {
    dispatch && dispatch({ type: "SET_SESSIONS", payload: [session] });

    const sessionAccount = session.namespaces?.hedera?.accounts?.[0];
    const accountId = sessionAccount?.split(":").pop();
    if (!accountId) {
      console.error("No account id found in the session");
    } else {
      const signer = dAppConnector?.getSigner(AccountId.fromString(accountId));
      dispatch && dispatch({ type: "SET_SIGNERS", payload: [signer!] });
    }
    debug && console.log("New connected session: ", session);
    debug && console.log("New connected accounts: ", session.namespaces?.hedera?.accounts);
  };

  /**
   * Handles the disconnection of all sessions.
   */
  const handleDisconnectSessions = useCallback(async () => {
    modalWrapper(async () => {
      await dAppConnector!.disconnectAll();
      dispatch && dispatch({ type: "SET_SIGNERS", payload: [] });
      dispatch && dispatch({ type: "SET_SESSIONS", payload: [] });
      dispatch && dispatch({ type: "UPDATE_MODAL_STATE", payload: { status: "Success", message: "Session disconnected" } });
    });
  }, [dispatch, modalWrapper, dAppConnector]);

  return { handleConnect, handleDisconnectSessions };
};

export default useConnectViaWalletConnect;
