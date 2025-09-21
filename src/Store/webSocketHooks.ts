/**
 * Redux WebSocket Integration Hooks
 *
 * Clean hooks for using WebSocket with Redux store
 * Provides typed selectors and action dispatchers
 */

import { useCallback, useEffect } from 'react';
import {
  createWebSocketClient,
  WebSocketClientManager,
} from '../services/websocket/WebSocketClient';
import { EntityBalances } from '../types/state';
import { setBalances } from './miscellaneousStoreSlice';
import { RootState, useAppDispatch, useAppSelector } from './store';
import {
  addBalanceUpdate,
  addNotification,
  setCampaignPublished,
  setConnectionState,
  updateCampaignMetrics,
  updateCampaignStatus,
  WebSocketState,
} from './webSocketSlice';

// WebSocket client instance (singleton)
let wsClient: WebSocketClientManager | null = null;

// WebSocket selectors
export const useWebSocketState = (): WebSocketState =>
  useAppSelector((state: RootState) => state.webSocket);

export const useIsWebSocketConnected = (): boolean =>
  useAppSelector((state: RootState) => state.webSocket.isConnected);

export const useWebSocketNotifications = () =>
  useAppSelector((state: RootState) => state.webSocket.notifications);

export const useUnreadNotificationCount = (): number =>
  useAppSelector((state: RootState) => state.webSocket.unreadNotificationCount);

export const useCampaignMetrics = () =>
  useAppSelector((state: RootState) => state.webSocket.campaignMetrics);

export const useLatestBalanceUpdates = () =>
  useAppSelector((state: RootState) => state.webSocket.latestBalanceUpdates);

// WebSocket connection hook
export const useWebSocketConnection = (
  wsUrl?: string,
  accessToken?: string
) => {
  const dispatch = useAppDispatch();
  const connectionState = useAppSelector(
    (state: RootState) => state.webSocket.connectionState
  );
  const balances = useAppSelector((state: RootState) => state.app.balances);

  const connect = useCallback(
    (url: string, token: string) => {
      // Disconnect existing connection if any
      if (wsClient) {
        wsClient.destroy();
      }

      dispatch(setConnectionState('CONNECTING'));

      try {
        // Create new WebSocket client
        wsClient = createWebSocketClient(url, token, {
          reconnectDelayMs: 3000,
          maxReconnectAttempts: 10,
          heartbeatIntervalMs: 30000,
        });

        // Set up connection event handlers
        wsClient.on('ws:connected', () => {
          dispatch(setConnectionState('CONNECTED'));
          dispatch(
            addNotification({
              level: 'success',
              message: 'Connected to real-time updates',
            })
          );
        });

        wsClient.on('ws:disconnected', () => {
          dispatch(setConnectionState('DISCONNECTED'));
          dispatch(
            addNotification({
              level: 'warning',
              message: 'Disconnected from real-time updates',
            })
          );
        });

        wsClient.on('ws:reconnecting', () => {
          dispatch(setConnectionState('RECONNECTING'));
        });

        wsClient.on('ws:error', ({ data }: { data: { error: unknown } }) => {
          const errorMessage = String(data.error);
          dispatch(setConnectionState('ERROR'));
          dispatch(
            addNotification({
              level: 'error',
              message: `Connection error: ${errorMessage}`,
            })
          );
        });

        // Campaign event handlers
        wsClient.on(
          'CAMPAIGN_PUBLISHED_SUCCESS',
          ({ data }: { data: unknown }) => {
            const eventData = data as { campaignId: string };

            dispatch(
              setCampaignPublished({
                campaignId: eventData.campaignId,
              })
            );

            dispatch(
              addNotification({
                level: 'success',
                message: 'Campaign published successfully! 🎉',
              })
            );
          }
        );

        wsClient.on('CAMPAIGN_STATUS_UPDATE', ({ data }: { data: unknown }) => {
          const eventData = data as {
            campaignId: string;
            newStatus: string;
          };

          dispatch(
            updateCampaignStatus({
              campaignId: eventData.campaignId,
              status: eventData.newStatus,
            })
          );

          dispatch(
            addNotification({
              level: 'info',
              message: `Campaign status updated to: ${eventData.newStatus}`,
            })
          );
        });

        wsClient.on(
          'CAMPAIGN_ENGAGEMENT_UPDATE',
          ({ data }: { data: unknown }) => {
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

            dispatch(
              updateCampaignMetrics({
                campaignId: eventData.campaignId,
                status: 'active',
                isPublished: true,
                engagementMetrics: eventData.engagementMetrics,
                lastUpdated: new Date(),
              })
            );
          }
        );

        // Balance update handlers
        wsClient.on('BALANCE_UPDATE', ({ data }: { data: unknown }) => {
          const eventData = data as {
            balanceType: 'HBAR' | 'TOKEN';
            newBalance: string;
            tokenId?: string;
            tokenSymbol?: string;
          };

          dispatch(
            addBalanceUpdate({
              balanceType: eventData.balanceType,
              newBalance: eventData.newBalance,
              tokenId: eventData.tokenId,
              tokenSymbol: eventData.tokenSymbol,
              timestamp: new Date(),
            })
          );

          // Update the main balances
          const updatedBalances = balances.map((balance: EntityBalances) => {
            if (
              eventData.balanceType === 'HBAR' &&
              balance.entityType === 'HBAR'
            ) {
              return { ...balance, entityBalance: eventData.newBalance };
            }
            if (
              eventData.balanceType === 'TOKEN' &&
              balance.entityId === eventData.tokenId
            ) {
              return { ...balance, entityBalance: eventData.newBalance };
            }
            return balance;
          });

          dispatch(setBalances(updatedBalances));

          const symbol = eventData.tokenSymbol || eventData.balanceType;
          dispatch(
            addNotification({
              level: 'info',
              message: `${symbol} balance updated: ${eventData.newBalance}`,
            })
          );
        });

        // Reward distribution updates
        wsClient.on(
          'REWARD_DISTRIBUTION_UPDATE',
          ({ data }: { data: unknown }) => {
            const eventData = data as {
              campaignId: string;
              recipientCount: number;
              totalAmount: string;
              tokenSymbol: string;
            };

            dispatch(
              addNotification({
                level: 'success',
                message: `Rewards distributed! ${eventData.recipientCount} recipients received ${eventData.totalAmount} ${eventData.tokenSymbol}`,
              })
            );
          }
        );

        // System notifications
        wsClient.on('SYSTEM_NOTIFICATION', ({ data }: { data: unknown }) => {
          const eventData = data as {
            level: 'info' | 'warning' | 'error' | 'success';
            message: string;
          };

          dispatch(
            addNotification({
              level: eventData.level,
              message: eventData.message,
            })
          );
        });
      } catch (error) {
        const errorMessage = `Failed to create WebSocket connection: ${error}`;
        dispatch(setConnectionState('ERROR'));
        dispatch(
          addNotification({
            level: 'error',
            message: errorMessage,
          })
        );
      }
    },
    [dispatch, balances]
  );

  const disconnect = () => {
    if (wsClient) {
      wsClient.destroy();
      wsClient = null;
    }
    dispatch(setConnectionState('DISCONNECTED'));
  };

  const sendMessage = (message: unknown): boolean => {
    if (wsClient && wsClient.isConnected()) {
      return wsClient.send(message);
    }
    dispatch(
      addNotification({
        level: 'warning',
        message: 'Cannot send message - WebSocket not connected',
      })
    );
    return false;
  };

  // Auto-connect if URL and token provided
  useEffect(() => {
    if (wsUrl && accessToken && connectionState === 'DISCONNECTED') {
      connect(wsUrl, accessToken);
    }

    return () => {
      // Cleanup on unmount
      if (wsClient) {
        wsClient.destroy();
        wsClient = null;
      }
    };
  }, [wsUrl, accessToken, connectionState, connect]);

  return {
    connect,
    disconnect,
    sendMessage,
    connectionState,
    isConnected: connectionState === 'CONNECTED',
  };
};

// Campaign-specific WebSocket hook
export const useCampaignWebSocketUpdates = (campaignId?: string) => {
  const campaignMetrics = useCampaignMetrics();
  const notifications = useWebSocketNotifications();

  // Get campaign-specific data
  const campaignData = campaignId ? campaignMetrics[campaignId] : null;

  // Get campaign-specific notifications
  const campaignNotifications = notifications.filter(
    notification =>
      notification.message.toLowerCase().includes('campaign') ||
      notification.message.toLowerCase().includes('published') ||
      notification.message.toLowerCase().includes('reward')
  );

  return {
    campaignData,
    campaignNotifications,
    hasUpdates: campaignNotifications.length > 0,
  };
};

// Balance-specific WebSocket hook
export const useBalanceWebSocketUpdates = () => {
  const balanceUpdates = useLatestBalanceUpdates();
  const notifications = useWebSocketNotifications();

  // Get balance-specific notifications
  const balanceNotifications = notifications.filter(
    notification =>
      notification.message.toLowerCase().includes('balance') ||
      notification.message.toLowerCase().includes('hbar') ||
      notification.message.toLowerCase().includes('token')
  );

  return {
    balanceUpdates,
    balanceNotifications,
    hasUpdates: balanceUpdates.length > 0 || balanceNotifications.length > 0,
  };
};
