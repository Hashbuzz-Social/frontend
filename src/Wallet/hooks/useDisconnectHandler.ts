import useSession from "./useSessions";

const useDisconnectHandler = () => {
  const { dAppConnector, state, dispatch } = useSession();
  const { sessions, signers } = state || {};

  const disconnect = async (topic?: string) => {
    if (topic) {
      await dAppConnector!.disconnect(topic);
    } else {
      await dAppConnector!.disconnectAll();
    }

    dispatch && dispatch({ type: "DISCONNECT", payload: { topic } });

    return { sessions, signers };
  };

  return { disconnect };
};

export default useDisconnectHandler;
