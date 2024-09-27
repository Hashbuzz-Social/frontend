import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState as HashConnectConnectionStatuses } from "hashconnect/dist/esm/types";
import React, { useCallback } from "react";
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
  }, [hashconnectRef, metaData, network, setState, debug]);

  const onFoundExtension = (data: HashConnectTypes.WalletMetadata) => {
    debug && console.log("Found extension", data);
    setState((exState) => ({ ...exState, availableExtension: data }));
  };

  const onParingEvent = async (data: MessageTypes.ApprovePairing) => {
    debug && console.log("Paired with wallet", data);
    setState((exState) => ({ ...exState, pairingData: data.pairingData }));
  };

  const onConnectionChange = (data: HashConnectConnectionStatuses) => {
    debug && console.log("hashconnect state change event", data);
    setState((exState) => ({ ...exState, state: data }));
  };

  return { initHashconnect, hashconnectRef, onFoundExtension, onParingEvent, onConnectionChange };
};

export default useHashConnect;
