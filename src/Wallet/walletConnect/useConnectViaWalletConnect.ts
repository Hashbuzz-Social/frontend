import { SessionTypes } from "@walletconnect/types";
import { useCallback } from "react";
import useModalWrapper from "./useModalWrapper";
import useWalletConnectService from "./useWalletConnectService";

/**
 * Custom hook to handle WalletConnect functionality.
 * @returns {Object} - An object containing handleConnect and handleDisconnectSessions functions.
 */
const useConnectViaWalletConnect = () => {
  const { dispatch, dAppConnector, setNewSession } = useWalletConnectService();
  const { modalWrapper } = useModalWrapper();

  /**
   * Handles the connection via WalletConnect.
   * @param {string} [extensionId] - Optional extension ID to connect.
   * @throws Will throw an error if dAppConnector is not available.
   */
  const handleConnect = useCallback(
    async (extensionId?: string) => {
      try {
        if (!dAppConnector) {
          throw new Error("dAppConnector is not available");
        }
        let session: SessionTypes.Struct;

        // Set loading state
        dispatch && dispatch({ type: "SET_LOADING", payload: true });

        if (extensionId) {
          session = await dAppConnector?.connectExtension(extensionId)!;
        } else {
          session = await dAppConnector?.openModal()!;
        }

        !!setNewSession && setNewSession(session);
      } finally {
        // Reset loading state
        dispatch && dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dAppConnector, dispatch, setNewSession]
  );

  /**
   * Handles the disconnection of all sessions.
   */
  const handleDisconnectSessions = useCallback(async () => {
    modalWrapper(async () => {
      console.log("Disconnecting all sessions");
      await dAppConnector!.disconnectAll();
      dispatch && dispatch({ type: "SET_DISCONNECTED_STAE" });
      dispatch && dispatch({ type: "UPDATE_MODAL_STATE", payload: { status: "Success", message: "Session disconnected" } });
    });
  }, [dispatch, modalWrapper, dAppConnector]);

  return { handleConnect, handleDisconnectSessions };
};

export default useConnectViaWalletConnect;
