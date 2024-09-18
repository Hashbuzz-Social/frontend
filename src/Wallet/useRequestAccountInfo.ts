import { useCallback, useContext } from 'react';
import { MessageTypes } from 'hashconnect';
import { HashconnectServiceContext } from './ConnectionProvider/HashconnectServiceContext';

export const useRequestAccountInfo = () => {
  const { topic, network, hashconnect } = useContext(HashconnectServiceContext);

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
