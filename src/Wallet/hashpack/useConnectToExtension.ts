import { useHashconnectService } from "./useHashconnectServicce";

export const useConnectToExtension = () => {
  const { hashconnect } = useHashconnectService();

  const connectToExtension = async () => {
    hashconnect?.connectToLocalWallet();
  };

  return connectToExtension;
};
