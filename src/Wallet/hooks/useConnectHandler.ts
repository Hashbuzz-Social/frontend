import { SessionTypes } from "@walletconnect/types";
import useSession from "./useSessions";

const getLastItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[array.length - 1];
};

const useConnectHandler = () => {
  const { dispatch, dAppConnector } = useSession();

  /**
   * Handle connect to the extension or open modal
   * @param extensionId  id of the extension to connect to
   */
  const handleConnect = async (extensionId?: string) => {
    try {
      if (!dAppConnector) throw new Error("DAppConnector is required");
      let session: SessionTypes.Struct;

      //   setIsLoading(true);
      dispatch({ type: "SET_LOADING", payload: true });

      if (extensionId) session = await dAppConnector.connectExtension(extensionId);
      else session = await dAppConnector.openModal();

      //   setNewSession(session);
      dispatch({ type: "ADD_SESSION", payload: session });

      const signers = dAppConnector.signers;

      dispatch({ type: "SET_SIGNERS", payload: signers });
      dispatch({ type: "SET_SELECTED_SIGNER", payload: getLastItem(signers) ?? null });
    } finally {
      //   setIsLoading(false);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return handleConnect;
};

export default useConnectHandler;
