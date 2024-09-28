import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState as HashConnectConnectionStatuses } from "hashconnect/dist/esm/types";
import React, { useCallback, useEffect } from "react";
import { Networks } from "../../types";
import { HashconnectState } from "./HashconnectProvider";

const useHashConnect = (metaData: HashConnectTypes.AppMetadata, network: Networks, setState: React.Dispatch<React.SetStateAction<Partial<HashconnectState>>>, hashconnectRef: React.MutableRefObject<HashConnect | null>, debug?: boolean) => {
  // Utility for logging if debug is enabled
  const log = useCallback(
    (...args: any[]) => {
      if (debug) console.log(...args);
    },
    [debug]
  );

  // Initialize HashConnect
  const initHashconnect = useCallback(async () => {
    log("Hashconnect Initializing HashConnect");

    if (!hashconnectRef.current) {
      hashconnectRef.current = new HashConnect(true);
    }

    const hashconnect = hashconnectRef.current;
    const { topic, pairingString, savedPairings } = await hashconnect.init(metaData, network, false);

    setState((prevState) => ({
      ...prevState,
      topic,
      pairingString,
      pairingData: savedPairings[0],
    }));

    log("HashConnect initialized with topic:", topic);
  }, [metaData, network, setState, hashconnectRef, log]);

  // Event handlers
  const handleFoundExtension = useCallback(
    (data: HashConnectTypes.WalletMetadata) => {
      log("Found extension:", data);
      setState((prevState) => ({ ...prevState, availableExtension: data }));
    },
    [setState, log]
  );

  const handlePairingEvent = useCallback(
    (data: MessageTypes.ApprovePairing) => {
      log("Paired with wallet:", data);
      setState((prevState) => ({ ...prevState, pairingData: data.pairingData }));
    },
    [setState, log]
  );

  const handleConnectionChange = useCallback(
    (state: HashConnectConnectionStatuses) => {
      log("HashConnect state change:", state);
      setState((prevState) => ({ ...prevState, state }));
    },
    [setState, log]
  );

  useEffect(() => {
    const hashconnect = hashconnectRef.current;
    if (hashconnect) {
      hashconnect.foundExtensionEvent.on(handleFoundExtension);
      hashconnect.pairingEvent.on(handlePairingEvent);
      hashconnect.connectionStatusChangeEvent.on(handleConnectionChange);
    }

    return () => {
      if (hashconnect) {
        hashconnect.foundExtensionEvent.off(handleFoundExtension);
        hashconnect.pairingEvent.off(handlePairingEvent);
        hashconnect.connectionStatusChangeEvent.off(handleConnectionChange);
      }
    };
  }, [hashconnectRef?.current, handleFoundExtension, handlePairingEvent, handleConnectionChange]);

  return { initHashconnect };
};

export default useHashConnect;
