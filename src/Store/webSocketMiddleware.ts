/**
 * WebSocket Redux Middleware
 *
 * Manages WebSocket connection lifecycle and dispatches events to Redux store
 * Replaces the need for providers or context by integrating directly with Redux
 */

import { Action, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import {
  createWebSocketClient,
  WebSocketClientManager,
} from '../services/websocket/WebSocketClient';
import { EntityBalances } from '../types/state';
import { setBalances } from './miscellaneousStoreSlice';
import {
  addBalanceUpdate,
  addEvent,
  addNotification,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  setCampaignPublished,
  setConnectionError,
  setConnectionState,
  updateCampaignMetrics,
  updateCampaignStatus,
} from './webSocketSlice';

// WebSocket middleware actions
export const WS_CONNECT = 'websocket/connect';
export const WS_DISCONNECT = 'websocket/disconnect';
export const WS_SEND_MESSAGE = 'websocket/sendMessage';

// Action types
interface WSConnectAction extends Action<typeof WS_CONNECT> {
  payload: { wsUrl: string; accessToken: string };
}

interface WSDisconnectAction extends Action<typeof WS_DISCONNECT> {
  type: typeof WS_DISCONNECT;
}

interface WSSendMessageAction extends Action<typeof WS_SEND_MESSAGE> {
  payload: unknown;
}

type WebSocketAction =
  | WSConnectAction
  | WSDisconnectAction
  | WSSendMessageAction;

// Action creators for WebSocket operations
export const wsConnect = (
  wsUrl: string,
  accessToken: string
): WSConnectAction => ({
  type: WS_CONNECT,
  payload: { wsUrl, accessToken },
});

export const wsDisconnect = (): WSDisconnectAction => ({
  type: WS_DISCONNECT,
});

export const wsSendMessage = (message: unknown): WSSendMessageAction => ({
  type: WS_SEND_MESSAGE,
  payload: message,
});

// WebSocket client instance
let wsClient: WebSocketClientManager | null = null;

export const webSocketMiddleware: Middleware<object, any> =
  (store: MiddlewareAPI<any, any>) => next => (action: unknown) => {
    const wsAction = action as WebSocketAction;

    switch (wsAction.type) {
      case WS_CONNECT: {
        const connectAction = wsAction as WSConnectAction;
        const { wsUrl, accessToken } = connectAction.payload;

        // Disconnect existing connection if any
        if (wsClient) {
          wsClient.destroy();
        }

        // Update connection state
        store.dispatch(setConnectionState('CONNECTING'));

        try {
          // Create new WebSocket client
          wsClient = createWebSocketClient(wsUrl, accessToken, {
            reconnectDelayMs: 3000,
            maxReconnectAttempts: 10,
            heartbeatIntervalMs: 30000,
          });

          // Set up connection event handlers
          wsClient.on('ws:connected', () => {
            store.dispatch(setConnectionState('CONNECTED'));
            store.dispatch(resetReconnectAttempts());
            store.dispatch(
              addNotification({
                level: 'success',
                message: 'Connected to real-time updates',
              })
            );
          });

          wsClient.on('ws:disconnected', () => {
            store.dispatch(setConnectionState('DISCONNECTED'));
            store.dispatch(
              addNotification({
                level: 'warning',
                message: 'Disconnected from real-time updates',
              })
            );
          });

          wsClient.on('ws:reconnecting', () => {
            store.dispatch(setConnectionState('RECONNECTING'));
            store.dispatch(incrementReconnectAttempts());
          });

          wsClient.on('ws:error', ({ data }: { data: { error: unknown } }) => {
            const errorMessage = String(data.error);
            store.dispatch(setConnectionError(errorMessage));
            store.dispatch(
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

              store.dispatch(
                addEvent({
                  eventType: 'CAMPAIGN_PUBLISHED_SUCCESS',
                  data,
                })
              );

              store.dispatch(
                setCampaignPublished({
                  campaignId: eventData.campaignId,
                })
              );

              store.dispatch(
                addNotification({
                  level: 'success',
                  message: 'Campaign published successfully! 🎉',
                })
              );
            }
          );

          wsClient.on(
            'CAMPAIGN_STATUS_UPDATE',
            ({ data }: { data: unknown }) => {
              const eventData = data as {
                campaignId: string;
                newStatus: string;
                previousStatus?: string;
              };

              store.dispatch(
                addEvent({
                  eventType: 'CAMPAIGN_STATUS_UPDATE',
                  data,
                })
              );

              store.dispatch(
                updateCampaignStatus({
                  campaignId: eventData.campaignId,
                  status: eventData.newStatus,
                })
              );

              store.dispatch(
                addNotification({
                  level: 'info',
                  message: `Campaign status updated to: ${eventData.newStatus}`,
                })
              );
            }
          );

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

              store.dispatch(
                addEvent({
                  eventType: 'CAMPAIGN_ENGAGEMENT_UPDATE',
                  data,
                })
              );

              store.dispatch(
                updateCampaignMetrics({
                  campaignId: eventData.campaignId,
                  status: 'active', // Default status, will be updated by status events
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
              userId: string;
            };

            store.dispatch(
              addEvent({
                eventType: 'BALANCE_UPDATE',
                data,
              })
            );

            store.dispatch(
              addBalanceUpdate({
                balanceType: eventData.balanceType,
                newBalance: eventData.newBalance,
                tokenId: eventData.tokenId,
                tokenSymbol: eventData.tokenSymbol,
                timestamp: new Date(),
              })
            );

            // Update the main balances in miscellaneous store
            const currentState = store.getState();
            const currentBalances = currentState.app.balances || [];

            // Find and update the specific balance
            const updatedBalances = currentBalances.map(
              (balance: EntityBalances) => {
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
              }
            );

            store.dispatch(setBalances(updatedBalances));

            const symbol = eventData.tokenSymbol || eventData.balanceType;
            store.dispatch(
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

              store.dispatch(
                addEvent({
                  eventType: 'REWARD_DISTRIBUTION_UPDATE',
                  data,
                })
              );

              store.dispatch(
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

            store.dispatch(
              addEvent({
                eventType: 'SYSTEM_NOTIFICATION',
                data,
              })
            );

            store.dispatch(
              addNotification({
                level: eventData.level,
                message: eventData.message,
              })
            );
          });
        } catch (error) {
          const errorMessage = `Failed to create WebSocket connection: ${error}`;
          store.dispatch(setConnectionError(errorMessage));
          store.dispatch(
            addNotification({
              level: 'error',
              message: errorMessage,
            })
          );
        }

        break;
      }

      case WS_DISCONNECT: {
        if (wsClient) {
          wsClient.destroy();
          wsClient = null;
        }
        store.dispatch(setConnectionState('DISCONNECTED'));
        break;
      }

      case WS_SEND_MESSAGE: {
        const sendAction = wsAction as WSSendMessageAction;
        if (wsClient && wsClient.isConnected()) {
          const sent = wsClient.send(sendAction.payload);
          if (!sent) {
            store.dispatch(
              addNotification({
                level: 'error',
                message: 'Failed to send WebSocket message',
              })
            );
          }
        } else {
          store.dispatch(
            addNotification({
              level: 'warning',
              message: 'Cannot send message - WebSocket not connected',
            })
          );
        }
        break;
      }
    }

    return next(action);
  };
