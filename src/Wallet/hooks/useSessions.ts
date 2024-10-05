// src/hooks/useSession.ts
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";
import { DAppConnector } from "@hashgraph/hedera-wallet-connect";

const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return { ...context, dAppConnector: context.dAppConnectorRef.current as DAppConnector };
};

export default useSession;
