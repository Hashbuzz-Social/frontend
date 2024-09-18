import { useContext } from 'react';
import { MessageTypes } from 'hashconnect';
import { HashconnectServiceContext } from './ConnectionProvider/HashconnectServiceContext';

export const useSendTransaction = () => {
  const { topic, hashconnect } = useContext(HashconnectServiceContext);

  const sendTransaction = async (trans: Uint8Array, acctToSign: string, return_trans: boolean = false, hideNfts: boolean = false) => {
    const transaction: MessageTypes.Transaction = {
      topic: topic!,
      byteArray: trans,
      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
        hideNft: hideNfts,
      },
    };

    const transactionResponse = await hashconnect?.sendTransaction(topic!, transaction);
    return transactionResponse;
  };

  return sendTransaction;
};
