import { useState, useCallback, useRef, useEffect } from "react";
import { ModalState } from "types";

const useAsyncStatusWrapper = () => {
  const [modalState, setModalState] = useState<ModalState>({
    status: "Info",
    message: "",
    isLoading: false,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const modalWrapper = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    try {
      if (isMounted.current) {
        setModalState({ status: "Info", message: "Processing request", isLoading: true });
      }
      const result = await fn();
      if (isMounted.current) {
        setModalState({ status: "Success", message: "The request has been executed successfully", isLoading: false, data: result });
      }
      return result;
    } catch (error: any) {
      console.error("Error signing message: ", error);
      if (isMounted.current) {
        setModalState({ status: "Error", message: error?.message || "An error occurred", isLoading: false });
      }
      return undefined;
    }
  }, []);

  return { modalState, modalWrapper };
};

export default useAsyncStatusWrapper;