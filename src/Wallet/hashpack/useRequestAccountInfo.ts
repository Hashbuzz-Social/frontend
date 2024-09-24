import { MessageTypes } from "hashconnect";
import { useCallback } from "react";
import { useHashconnectService } from "./useHashconnectServicce";

export const useRequestAccountInfo = () => {
  const { topic, network, hashconnect } = useHashconnectService();

  const requestAccountInfo = useCallback(async () => {
    const request: MessageTypes.AdditionalAccountRequest = {
      topic: topic!,
      network: network!,
      multiAccount: true,
    };

    await hashconnect?.requestAdditionalAccounts(topic!, request);
  }, [hashconnect, network, topic]);

  return requestAccountInfo;
};
