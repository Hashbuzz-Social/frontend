/**
 * React Hook for WebSocket Management
 *
 * Provides a React hook to manage WebSocket connections with automatic
 * lifecycle management and state updates
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  WebSocketClientManager,
  WebSocketConfig,
  createWebSocketClient,
} from '../services/websocket/WebSocketClient';

export interface WebSocketHookConfig extends Partial<WebSocketConfig> {
  wsUrl: string;
  accessToken: string;
  autoConnect?: boolean;
}

export interface WebSocketState {
  isConnected: boolean;
  connectionState: string;
  reconnectAttempts: number;
  lastError?: string;
}

export interface WebSocketHookReturn {
  // Connection state
  state: WebSocketState;

  // Connection control
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;

  // Event subscription methods
  onCampaignPublished: (handler: (data: unknown) => void) => () => void;
  onBalanceUpdate: (handler: (data: unknown) => void) => () => void;
  onCampaignStatusUpdate: (handler: (data: unknown) => void) => () => void;
  onCampaignEngagementUpdate: (handler: (data: unknown) => void) => () => void;
  onRewardDistributionUpdate: (handler: (data: unknown) => void) => () => void;
  onSystemNotification: (handler: (data: unknown) => void) => () => void;

  // Generic event subscription
  on: (eventType: string, handler: (data: unknown) => void) => () => void;

  // Send message
  send: (message: unknown) => boolean;
}

export function useWebSocket(config: WebSocketHookConfig): WebSocketHookReturn {
  const wsClientRef = useRef<WebSocketClientManager | null>(null);
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    connectionState: 'DISCONNECTED',
    reconnectAttempts: 0,
  });

  const updateState = useCallback(() => {
    if (wsClientRef.current) {
      setState(prevState => ({
        ...prevState,
        isConnected: wsClientRef.current?.isConnected() ?? false,
        connectionState: wsClientRef.current?.getState() ?? 'DISCONNECTED',
      }));
    }
  }, []);

  const connect = useCallback(() => {
    if (!wsClientRef.current) {
      wsClientRef.current = createWebSocketClient(
        config.wsUrl,
        config.accessToken,
        config
      );

      // Set up connection event listeners
      wsClientRef.current.on('ws:connected', () => {
        updateState();
      });

      wsClientRef.current.on('ws:disconnected', () => {
        updateState();
      });

      wsClientRef.current.on(
        'ws:error',
        ({ data }: { data: { error: unknown } }) => {
          setState(prevState => ({
            ...prevState,
            lastError: String(data.error),
          }));
          updateState();
        }
      );
    }
  }, [config, updateState]);

  const disconnect = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
      updateState();
    }
  }, [updateState]);

  const reconnect = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.reconnect();
    } else {
      connect();
    }
  }, [connect]);

  // Generic event subscription
  const on = useCallback(
    (eventType: string, handler: (data: unknown) => void) => {
      if (!wsClientRef.current) {
        console.warn('WebSocket client not initialized');
        return () => {
          /* no-op */
        };
      }

      wsClientRef.current.on(eventType, handler);

      // Return cleanup function
      return () => {
        if (wsClientRef.current) {
          wsClientRef.current.off(eventType, handler);
        }
      };
    },
    []
  );

  // Specific event subscriptions with cleanup
  const onCampaignPublished = useCallback(
    (handler: (data: unknown) => void) => {
      return on('CAMPAIGN_PUBLISHED_SUCCESS', handler);
    },
    [on]
  );

  const onBalanceUpdate = useCallback(
    (handler: (data: unknown) => void) => {
      return on('BALANCE_UPDATE', handler);
    },
    [on]
  );

  const onCampaignStatusUpdate = useCallback(
    (handler: (data: unknown) => void) => {
      return on('CAMPAIGN_STATUS_UPDATE', handler);
    },
    [on]
  );

  const onCampaignEngagementUpdate = useCallback(
    (handler: (data: unknown) => void) => {
      return on('CAMPAIGN_ENGAGEMENT_UPDATE', handler);
    },
    [on]
  );

  const onRewardDistributionUpdate = useCallback(
    (handler: (data: unknown) => void) => {
      return on('REWARD_DISTRIBUTION_UPDATE', handler);
    },
    [on]
  );

  const onSystemNotification = useCallback(
    (handler: (data: unknown) => void) => {
      return on('SYSTEM_NOTIFICATION', handler);
    },
    [on]
  );

  const send = useCallback((message: unknown): boolean => {
    if (!wsClientRef.current) {
      console.warn('WebSocket client not initialized');
      return false;
    }
    return wsClientRef.current.send(message);
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (config.autoConnect !== false) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.destroy();
        wsClientRef.current = null;
      }
    };
  }, [config.autoConnect, connect]);

  // Update state periodically
  useEffect(() => {
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [updateState]);

  return {
    state,
    connect,
    disconnect,
    reconnect,
    onCampaignPublished,
    onBalanceUpdate,
    onCampaignStatusUpdate,
    onCampaignEngagementUpdate,
    onRewardDistributionUpdate,
    onSystemNotification,
    on,
    send,
  };
}

// Hook for campaign-specific WebSocket events
export function useCampaignWebSocket(
  wsUrl: string,
  accessToken: string,
  campaignId: string
) {
  const websocket = useWebSocket({
    wsUrl,
    accessToken,
    autoConnect: true,
  });

  const [campaignState, setCampaignState] = useState({
    status: 'unknown',
    isPublished: false,
    engagementMetrics: {
      totalLikes: 0,
      totalRetweets: 0,
      totalComments: 0,
      uniqueParticipants: 0,
      engagementRate: 0,
    },
  });

  useEffect(() => {
    // Campaign published success
    const unsubscribePublished = websocket.onCampaignPublished(
      (data: unknown) => {
        const eventData = data as { campaignId: string };
        if (eventData.campaignId === campaignId) {
          setCampaignState(prev => ({
            ...prev,
            isPublished: true,
            status: 'published',
          }));
        }
      }
    );

    // Campaign status updates
    const unsubscribeStatus = websocket.onCampaignStatusUpdate(
      (data: unknown) => {
        const eventData = data as { campaignId: string; newStatus: string };
        if (eventData.campaignId === campaignId) {
          setCampaignState(prev => ({
            ...prev,
            status: eventData.newStatus,
          }));
        }
      }
    );

    // Campaign engagement updates
    const unsubscribeEngagement = websocket.onCampaignEngagementUpdate(
      (data: unknown) => {
        const eventData = data as {
          campaignId: string;
          engagementMetrics: {
            totalLikes: number;
            totalRetweets: number;
            totalComments: number;
            uniqueParticipants: number;
            engagementRate: number;
          };
        };
        if (eventData.campaignId === campaignId) {
          setCampaignState(prev => ({
            ...prev,
            engagementMetrics: eventData.engagementMetrics,
          }));
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribePublished();
      unsubscribeStatus();
      unsubscribeEngagement();
    };
  }, [websocket, campaignId]);

  return {
    ...websocket,
    campaignState,
  };
}

// Hook for balance-specific WebSocket events
export function useBalanceWebSocket(wsUrl: string, accessToken: string) {
  const websocket = useWebSocket({
    wsUrl,
    accessToken,
    autoConnect: true,
  });

  const [balances, setBalances] = useState<Record<string, string>>({
    HBAR: '0',
  });

  useEffect(() => {
    const unsubscribeBalance = websocket.onBalanceUpdate((data: unknown) => {
      const eventData = data as {
        balanceType: 'HBAR' | 'TOKEN';
        tokenId?: string;
        tokenSymbol?: string;
        newBalance: string;
      };

      const key =
        eventData.balanceType === 'HBAR'
          ? 'HBAR'
          : eventData.tokenId || eventData.tokenSymbol || 'TOKEN';

      setBalances(prev => ({
        ...prev,
        [key]: eventData.newBalance,
      }));
    });

    return () => {
      unsubscribeBalance();
    };
  }, [websocket]);

  return {
    ...websocket,
    balances,
  };
}
