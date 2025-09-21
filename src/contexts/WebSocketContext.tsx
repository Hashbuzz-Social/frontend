/**
 * WebSocket Context Provider
 *
 * Provides WebSocket functionality throughout the React app
 * using React Context API
 */

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useWebSocket, WebSocketHookReturn } from '../hooks/useWebSocket';

interface WebSocketContextType extends WebSocketHookReturn {
  // Additional context-specific methods or state
  isReady: boolean;
  connectionHistory: Array<{
    timestamp: Date;
    event: string;
    details?: string;
  }>;
}

interface WebSocketProviderProps {
  children: ReactNode;
  wsUrl: string;
  accessToken: string;
  autoConnect?: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  wsUrl,
  accessToken,
  autoConnect = true,
}) => {
  const websocket = useWebSocket({
    wsUrl,
    accessToken,
    autoConnect,
    reconnectDelayMs: 3000,
    maxReconnectAttempts: 10,
    heartbeatIntervalMs: 30000,
  });

  const [isReady, setIsReady] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState<
    Array<{
      timestamp: Date;
      event: string;
      details?: string;
    }>
  >([]);

  // Track connection history
  const addToHistory = (event: string, details?: string) => {
    setConnectionHistory(prev => [
      { timestamp: new Date(), event, details },
      ...prev.slice(0, 99), // Keep last 100 events
    ]);
  };

  useEffect(() => {
    // Monitor connection state changes
    if (websocket.state.isConnected) {
      setIsReady(true);
      addToHistory('CONNECTED');
    } else {
      setIsReady(false);
      addToHistory('DISCONNECTED');
    }
  }, [websocket.state.isConnected]);

  useEffect(() => {
    // Monitor connection state changes
    addToHistory('STATE_CHANGE', websocket.state.connectionState);
  }, [websocket.state.connectionState]);

  useEffect(() => {
    // Monitor errors
    if (websocket.state.lastError) {
      addToHistory('ERROR', websocket.state.lastError);
    }
  }, [websocket.state.lastError]);

  const contextValue: WebSocketContextType = {
    ...websocket,
    isReady,
    connectionHistory,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Export context type and context for use in hooks
export { WebSocketContext };
export type { WebSocketContextType };
