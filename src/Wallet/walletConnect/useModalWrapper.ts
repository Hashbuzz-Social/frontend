import { useCallback, useContext, useMemo } from "react";
import { HashconnectServiceContext } from "../ConnectionProvider/HashconnectProvider";

const useModalWrapper = () => {
  const { dispatch, walletConnectState } = useContext(HashconnectServiceContext);
  const modalState = walletConnectState?.modalState;
  const isLoading = modalState?.isLoading;
  const status = modalState?.status;
  const message = modalState?.message;
  const data = modalState?.data;

  const modalWrapper = useCallback(
    async (fn: () => Promise<any>) => {
      try {
        dispatch && dispatch({ type: "SET_MODAL_STATE", payload: { status: "Info", message: "Processing request", isLoading: true } });
        const result = await fn();
        dispatch &&
          dispatch({
            type: "UPDATE_MODAL_STATE",
            payload: { status: "Success", message: "The request has been executed successfully", data: result },
          });
      } catch (error) {
        console.error("Error signing message: ", error);
        //@ts-ignore
        dispatch && dispatch({ type: "UPDATE_MODAL_STATE", payload: { status: "Error", message: `${error?.message as any as string}` } });
      } finally {
        dispatch && dispatch({ type: "UPDATE_MODAL_STATE", payload: { isLoading: false } });
      }
    },
    [dispatch]
  );

  const memoizedModalState = useMemo(() => ({ isLoading, status, message, data }), [isLoading, status, message, data]);

  return { modalWrapper, ...memoizedModalState };
};

export default useModalWrapper;
