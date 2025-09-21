/**
 * WebSocket Test Utilities
 *
 * Utilities for testing and debugging WebSocket functionality
 * in development environment
 */

import { store } from '../Store/store';
import {
  addBalanceUpdate,
  addEvent,
  addNotification,
  BalanceUpdate,
  CampaignMetrics,
  SystemNotification,
  updateCampaignMetrics,
  WebSocketEvent,
} from '../Store/webSocketSlice';

/**
 * Simulate real-time campaign updates for testing
 */
export const simulateCampaignUpdate = (campaignId: string) => {
  const dispatch = store.dispatch;

  // Simulate campaign metrics update
  const mockMetrics: CampaignMetrics = {
    campaignId,
    status: 'ACTIVE',
    isPublished: true,
    engagementMetrics: {
      totalLikes: Math.floor(Math.random() * 1000) + 50,
      totalRetweets: Math.floor(Math.random() * 500) + 25,
      totalComments: Math.floor(Math.random() * 200) + 10,
      uniqueParticipants: Math.floor(Math.random() * 100) + 20,
      engagementRate: Math.random() * 15 + 5, // 5-20% engagement rate
    },
    lastUpdated: new Date(),
  };

  dispatch(updateCampaignMetrics(mockMetrics));

  // Add event to history
  const event: WebSocketEvent = {
    id: `evt_${Date.now()}`,
    eventType: 'CAMPAIGN_METRICS_UPDATE',
    timestamp: new Date(),
    data: mockMetrics,
  };

  dispatch(addEvent(event));
};

/**
 * Simulate balance update for testing
 */
export const simulateBalanceUpdate = (
  balanceType: 'HBAR' | 'TOKEN' = 'HBAR'
) => {
  const dispatch = store.dispatch;

  const mockBalance: BalanceUpdate = {
    balanceType,
    newBalance:
      balanceType === 'HBAR'
        ? (Math.random() * 1000).toFixed(6) // Random HBAR amount
        : Math.floor(Math.random() * 10000).toString(), // Random token amount
    tokenId: balanceType === 'TOKEN' ? '0.0.123456' : undefined,
    tokenSymbol: balanceType === 'TOKEN' ? 'BUZZ' : undefined,
    timestamp: new Date(),
  };

  dispatch(addBalanceUpdate(mockBalance));

  // Add event to history
  const event: WebSocketEvent = {
    id: `evt_${Date.now()}`,
    eventType: 'BALANCE_UPDATE',
    timestamp: new Date(),
    data: mockBalance,
  };

  dispatch(addEvent(event));
};

/**
 * Simulate system notification for testing
 */
export const simulateSystemNotification = (
  level: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  const dispatch = store.dispatch;

  const messages = {
    info: 'Your campaign has received new engagement!',
    success: 'Campaign rewards have been distributed successfully!',
    warning: 'Your campaign is approaching its budget limit.',
    error: 'Failed to process campaign transaction. Please try again.',
  };

  const mockNotification: SystemNotification = {
    id: `notif_${Date.now()}`,
    level,
    message: messages[level],
    timestamp: new Date(),
    read: false,
  };

  dispatch(addNotification(mockNotification));

  // Add event to history
  const event: WebSocketEvent = {
    id: `evt_${Date.now()}`,
    eventType: 'SYSTEM_NOTIFICATION',
    timestamp: new Date(),
    data: mockNotification,
  };

  dispatch(addEvent(event));
};

/**
 * Start simulation of various WebSocket events
 * Useful for testing the UI without a real WebSocket connection
 */
export const startEventSimulation = (intervalMs: number = 5000) => {
  const simulationTypes = [
    () => simulateCampaignUpdate('camp_123'),
    () => simulateCampaignUpdate('camp_456'),
    () => simulateBalanceUpdate('HBAR'),
    () => simulateBalanceUpdate('TOKEN'),
    () => simulateSystemNotification('info'),
    () => simulateSystemNotification('success'),
  ];

  const interval = setInterval(() => {
    const randomSimulation =
      simulationTypes[Math.floor(Math.random() * simulationTypes.length)];
    randomSimulation();
  }, intervalMs);

  console.warn(
    'WebSocket event simulation started. Call stopEventSimulation() to stop.'
  );

  return interval;
};

/**
 * Stop event simulation
 */
export const stopEventSimulation = (intervalId: NodeJS.Timeout) => {
  clearInterval(intervalId);
  console.warn('WebSocket event simulation stopped.');
};

/**
 * Get WebSocket state for debugging
 */
export const getWebSocketDebugInfo = () => {
  const state = store.getState().webSocket;

  return {
    connectionState: state.connectionState,
    isConnected: state.isConnected,
    reconnectAttempts: state.reconnectAttempts,
    lastError: state.lastError,
    wsUrl: state.wsUrl,
    eventCount: state.events.length,
    campaignCount: Object.keys(state.campaignMetrics).length,
    balanceUpdateCount: state.latestBalanceUpdates.length,
    notificationCount: state.notifications.length,
    unreadNotifications: state.unreadNotificationCount,
  };
};

/**
 * Log WebSocket state to console (development only)
 */
export const logWebSocketState = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('WebSocket Debug Info:', getWebSocketDebugInfo());
  }
};
