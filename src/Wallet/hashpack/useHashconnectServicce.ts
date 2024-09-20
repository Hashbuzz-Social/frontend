import { useContext } from 'react';
import { HashconnectServiceContext } from '../ConnectionProvider/HashconnectServiceContext';

export const useHashconnectService = () => {
  const context = useContext(HashconnectServiceContext);
  return {
    ...context,
   
  };
};
