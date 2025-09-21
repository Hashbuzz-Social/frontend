/**
 * WebSocket Context Hooks
 *
 * Hooks for interacting with the WebSocket context
 */

import React, { useContext, useEffect, useState } from 'react';
import {
  WebSocketContext,
  WebSocketContextType,
} from '../contexts/WebSocketContext';

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketProvider'
    );
  }
  return context;
};

// Higher-order component for WebSocket functionality
export interface WithWebSocketProps {
  websocket: WebSocketContextType;
}

export function withWebSocket<P extends WithWebSocketProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithWebSocketComponent: React.FC<Omit<P, 'websocket'>> = props => {
    const websocket = useWebSocketContext();
    return React.createElement(WrappedComponent, { ...props, websocket } as P);
  };

  WithWebSocketComponent.displayName = `withWebSocket(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithWebSocketComponent;
}

// Hooks for specific WebSocket events with context
export const useCampaignEvents = (campaignId?: string) => {
  const websocket = useWebSocketContext();
  const [events, setEvents] = useState<
    Array<{
      id: string;
      eventType: string;
      campaignId: string;
      timestamp: Date;
      data: unknown;
    }>
  >([]);

  useEffect(() => {
    const unsubscribeFunctions: (() => void)[] = [];

    // Campaign published
    unsubscribeFunctions.push(
      websocket.onCampaignPublished((data: unknown) => {
        const eventData = data as { campaignId: string };
        if (!campaignId || eventData.campaignId === campaignId) {
          setEvents(prev => [
            {
              id: `pub-${Date.now()}`,
              eventType: 'PUBLISHED',
              campaignId: eventData.campaignId,
              timestamp: new Date(),
              data,
            },
            ...prev.slice(0, 49),
          ]);
        }
      })
    );

    // Campaign status updates
    unsubscribeFunctions.push(
      websocket.onCampaignStatusUpdate((data: unknown) => {
        const eventData = data as { campaignId: string; newStatus: string };
        if (!campaignId || eventData.campaignId === campaignId) {
          setEvents(prev => [
            {
              id: `status-${Date.now()}`,
              eventType: 'STATUS_UPDATE',
              campaignId: eventData.campaignId,
              timestamp: new Date(),
              data,
            },
            ...prev.slice(0, 49),
          ]);
        }
      })
    );

    // Campaign engagement updates
    unsubscribeFunctions.push(
      websocket.onCampaignEngagementUpdate((data: unknown) => {
        const eventData = data as { campaignId: string };
        if (!campaignId || eventData.campaignId === campaignId) {
          setEvents(prev => [
            {
              id: `engagement-${Date.now()}`,
              eventType: 'ENGAGEMENT_UPDATE',
              campaignId: eventData.campaignId,
              timestamp: new Date(),
              data,
            },
            ...prev.slice(0, 49),
          ]);
        }
      })
    );

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [websocket, campaignId]);

  return { events, clearEvents: () => setEvents([]) };
};

export const useBalanceEvents = () => {
  const websocket = useWebSocketContext();
  const [events, setEvents] = useState<
    Array<{
      id: string;
      balanceType: string;
      newBalance: string;
      timestamp: Date;
      data: unknown;
    }>
  >([]);

  useEffect(() => {
    const unsubscribe = websocket.onBalanceUpdate((data: unknown) => {
      const eventData = data as {
        balanceType: string;
        newBalance: string;
        tokenId?: string;
        tokenSymbol?: string;
      };

      setEvents(prev => [
        {
          id: `balance-${Date.now()}`,
          balanceType: eventData.balanceType,
          newBalance: eventData.newBalance,
          timestamp: new Date(),
          data,
        },
        ...prev.slice(0, 49),
      ]);
    });

    return unsubscribe;
  }, [websocket]);

  return { events, clearEvents: () => setEvents([]) };
};
