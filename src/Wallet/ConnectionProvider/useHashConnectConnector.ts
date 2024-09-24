import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState as HashConnectConnectionStatuses } from "hashconnect/dist/esm/types";
import React, { useCallback, useEffect } from "react";
import { Networks } from "../../types";
import { HashconnectState } from "./HashconnectServiceContext";

const useHashConnect = (metaData: HashConnectTypes.AppMetadata, network: Networks, setState: React.Dispatch<React.SetStateAction<Partial<HashconnectState>>>, hashconnectRef: React.MutableRefObject<HashConnect | null>, debug?: boolean) => {
  const initHashconnect = useCallback(async () => {
    !!debug && console.log("Hashconnect Initializing HashConnect");
    if (!hashconnectRef.current) {
      hashconnectRef.current = new HashConnect(true);
    }
    const hashconnect = hashconnectRef.current;
    const initData = await hashconnect.init(metaData, network, false);
    const { topic, pairingString, savedPairings } = initData;
    setState((prevState) => ({ ...prevState, topic, pairingString, pairingData: savedPairings[0] }));
    debug && console.log("HashConnect initialized with topic:", topic);
  }, [metaData, network, setState]);

  const handleFoundExtension = useCallback(
    (data: HashConnectTypes.WalletMetadata) => {
      !!debug && console.log("Found extension:", data);
      setState((prevState) => ({ ...prevState, availableExtension: data }));
    },
    [setState, debug]
  );

  const handlePairingEvent = useCallback(
    (data: MessageTypes.ApprovePairing) => {
      !!debug && console.log("Paired with wallet:", data);
      setState((prevState) => ({ ...prevState, pairingData: data.pairingData }));
    },
    [setState, debug]
  );

  const handleConnectionChange = useCallback(
    (state: HashConnectConnectionStatuses) => {
      !!debug && console.log("HashConnect state change:", state);
      setState((prevState) => ({ ...prevState, state }));
    },
    [setState, debug]
  );

  useEffect(() => {
    if (hashconnectRef.current) {
      !!debug && console.log("Hashconnect Ref for hashconnect initilaization ", hashconnectRef.current);
      hashconnectRef.current.foundExtensionEvent.on(handleFoundExtension);
      hashconnectRef.current.pairingEvent.on(handlePairingEvent);
      hashconnectRef.current.connectionStatusChangeEvent.on(handleConnectionChange);

      return () => {
        hashconnectRef.current?.foundExtensionEvent.off(handleFoundExtension);
        hashconnectRef.current?.pairingEvent.off(handlePairingEvent);
        hashconnectRef.current?.connectionStatusChangeEvent.off(handleConnectionChange);
      };
    }
  }, [hashconnectRef.current, handleFoundExtension, handlePairingEvent, handleConnectionChange, debug]);

  return { initHashconnect, hashconnectRef };
};

export default useHashConnect;
