// src/hooks/useConnector.ts
import { useContext } from "react";
import { ConnectorContext } from "../context/ConnectorContext";

const useConnector = () => {
  const context = useContext(ConnectorContext);
  if (!context) {
    throw new Error("useConnector must be used within a ConnectorProvider");
  }
  return context;
};

export default useConnector;
