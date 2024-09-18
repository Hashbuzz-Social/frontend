import { useContext } from 'react';
import { HashconnectServiceContext } from './ConnectionProvider/HashconnectServiceContext';
// import { HashconnectServiceContext } from './ConnectionProvider';

export const useConnectToExtension = () => {
  const { hashconnect } = useContext(HashconnectServiceContext);

  const connectToExtension = async () => {
    hashconnect?.connectToLocalWallet();
  };

  return connectToExtension;
};
