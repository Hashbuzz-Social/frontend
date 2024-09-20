import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/esm/types";
import React, { useCallback, useEffect, useRef } from "react";
import { Networks } from "../../types";
import { HashconnectContextAPI } from "./HashconnectServiceContext";

const useHashConnect = (metaData: HashConnectTypes.AppMetadata, network: Networks, setState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>, debug?: boolean) => {
  const hashconnectRef = useRef<HashConnect | null>(null);

  const initHashconnect = useCallback(async () => {
    if (!hashconnectRef.current) {
      hashconnectRef.current = new HashConnect(true);
    }
    const hashconnect = hashconnectRef.current;
    const initData = await hashconnect.init(metaData, network, false);
    const { topic, pairingString, savedPairings } = initData;
    setState((prevState) => ({ ...prevState, topic, pairingString, pairingData: savedPairings[0] }));
  }, [metaData, network, setState]);

  const handleFoundExtension = useCallback(
    (data: HashConnectTypes.WalletMetadata) => {
      debug && console.log("Found extension:", data);
      setState((prevState) => ({ ...prevState, availableExtension: data }));
    },
    [setState, debug]
  );

  const handlePairingEvent = useCallback(
    (data: MessageTypes.ApprovePairing) => {
      debug && console.log("Paired with wallet:", data);
      setState((prevState) => ({ ...prevState, pairingData: data.pairingData }));
    },
    [setState, debug]
  );

  const handleConnectionChange = useCallback(
    (state: HashConnectConnectionState) => {
      debug && console.log("HashConnect state change:", state);
      setState((prevState) => ({ ...prevState, state }));
    },
    [setState, debug]
  );

  useEffect(() => {
    if (hashconnectRef.current) {
      hashconnectRef.current.foundExtensionEvent.on(handleFoundExtension);
      hashconnectRef.current.pairingEvent.on(handlePairingEvent);
      hashconnectRef.current.connectionStatusChangeEvent.on(handleConnectionChange);

      return () => {
        hashconnectRef.current?.foundExtensionEvent.off(handleFoundExtension);
        hashconnectRef.current?.pairingEvent.off(handlePairingEvent);
        hashconnectRef.current?.connectionStatusChangeEvent.off(handleConnectionChange);
      };
    }
  }, [handleFoundExtension, handlePairingEvent, handleConnectionChange]);

  return { initHashconnect  , hashconnectRef};
};


export default useHashConnect;