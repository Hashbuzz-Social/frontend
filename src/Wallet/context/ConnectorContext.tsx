// src/contexts/ConnectorContext.tsx
import React, { createContext, ReactNode } from "react";
import connectorConfig from "../config/connectorConfig";

export interface ConnectorContextProps {
  projectId: string;
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export const ConnectorContext = createContext<ConnectorContextProps | undefined>(undefined);

export const ConnectorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ConnectorContext.Provider value={connectorConfig}>{children}</ConnectorContext.Provider>;
};
