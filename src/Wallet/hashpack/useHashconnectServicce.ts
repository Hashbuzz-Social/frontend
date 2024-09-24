import { useContext } from "react";
import { HashconnectServiceContext } from "../ConnectionProvider/HashconnectServiceContext";

export const useHashconnectService = () => {
  const { hashconnect, hashconnectState, network, setState } = useContext(HashconnectServiceContext);
  return { hashconnect, network, setState, ...(hashconnectState && { ...hashconnectState }) };
};
