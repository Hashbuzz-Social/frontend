/**
 * WebSocket Redux Slice
 *
 * Manages WebSocket connection state and real-time events
 * Integrates with existing Redux store for clean state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// WebSocket connection states
export type WebSocketConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'ERROR';

// Event types for real-time updates
export interface WebSocketEvent {
  id: string;
  eventType: string;
  timestamp: Date;
  data: unknown;
}

// Campaign real-time metrics
export interface CampaignMetrics {
  campaignId: string;
  status: string;
  isPublished: boolean;
  engagementMetrics: {
    totalLikes: number;
    totalRetweets: number;
    totalComments: number;
    uniqueParticipants: number;
    engagementRate: number;
  };
  lastUpdated: Date;
}

// Balance update from WebSocket
export interface BalanceUpdate {
  balanceType: 'HBAR' | 'TOKEN';
  newBalance: string;
  tokenId?: string;
  tokenSymbol?: string;
  timestamp: Date;
}

// System notification
export interface SystemNotification {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface WebSocketState {
  // Connection management
  connectionState: WebSocketConnectionState;
  isConnected: boolean;
  reconnectAttempts: number;
  lastError: string | null;

  // Connection configuration
  wsUrl: string | null;
  accessToken: string | null;

  // Event history
  events: WebSocketEvent[];
  connectionHistory: Array<{
    timestamp: Date;
    event: string;
    details?: string;
  }>;

  // Real-time campaign data
  campaignMetrics: Record<string, CampaignMetrics>;

  // Real-time balance data
  latestBalanceUpdates: BalanceUpdate[];

  // System notifications
  notifications: SystemNotification[];
  unreadNotificationCount: number;

  // UI state
  showConnectionStatus: boolean;
  showEventLog: boolean;
}

const initialState: WebSocketState = {
  connectionState: 'DISCONNECTED',
  isConnected: false,
  reconnectAttempts: 0,
  lastError: null,
  wsUrl: null,
  accessToken: null,
  events: [],
  connectionHistory: [],
  campaignMetrics: {},
  latestBalanceUpdates: [],
  notifications: [],
  unreadNotificationCount: 0,
  showConnectionStatus: false,
  showEventLog: false,
};

const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    // Connection management
    setConnectionState: (
      state,
      action: PayloadAction<WebSocketConnectionState>
    ) => {
      state.connectionState = action.payload;
      state.isConnected = action.payload === 'CONNECTED';

      // Add to connection history
      state.connectionHistory.unshift({
        timestamp: new Date(),
        event: action.payload,
      });

      // Keep last 100 history entries
      if (state.connectionHistory.length > 100) {
        state.connectionHistory = state.connectionHistory.slice(0, 100);
      }
    },

    setConnectionConfig: (
      state,
      action: PayloadAction<{ wsUrl: string; accessToken: string }>
    ) => {
      state.wsUrl = action.payload.wsUrl;
      state.accessToken = action.payload.accessToken;
    },

    setConnectionError: (state, action: PayloadAction<string>) => {
      state.lastError = action.payload;
      state.connectionState = 'ERROR';
      state.isConnected = false;

      state.connectionHistory.unshift({
        timestamp: new Date(),
        event: 'ERROR',
        details: action.payload,
      });
    },

    incrementReconnectAttempts: state => {
      state.reconnectAttempts += 1;
    },

    resetReconnectAttempts: state => {
      state.reconnectAttempts = 0;
    },

    // Event management
    addEvent: (
      state,
      action: PayloadAction<Omit<WebSocketEvent, 'id' | 'timestamp'>>
    ) => {
      const event: WebSocketEvent = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };

      state.events.unshift(event);

      // Keep last 50 events
      if (state.events.length > 50) {
        state.events = state.events.slice(0, 50);
      }
    },

    clearEvents: state => {
      state.events = [];
    },

    // Campaign real-time updates
    updateCampaignMetrics: (state, action: PayloadAction<CampaignMetrics>) => {
      const metrics = action.payload;
      state.campaignMetrics[metrics.campaignId] = {
        ...metrics,
        lastUpdated: new Date(),
      };
    },

    setCampaignPublished: (
      state,
      action: PayloadAction<{ campaignId: string }>
    ) => {
      const { campaignId } = action.payload;
      if (state.campaignMetrics[campaignId]) {
        state.campaignMetrics[campaignId].isPublished = true;
        state.campaignMetrics[campaignId].status = 'published';
        state.campaignMetrics[campaignId].lastUpdated = new Date();
      }
    },

    updateCampaignStatus: (
      state,
      action: PayloadAction<{ campaignId: string; status: string }>
    ) => {
      const { campaignId, status } = action.payload;
      if (state.campaignMetrics[campaignId]) {
        state.campaignMetrics[campaignId].status = status;
        state.campaignMetrics[campaignId].lastUpdated = new Date();
      }
    },

    // Balance updates
    addBalanceUpdate: (state, action: PayloadAction<BalanceUpdate>) => {
      const update = {
        ...action.payload,
        timestamp: new Date(),
      };

      state.latestBalanceUpdates.unshift(update);

      // Keep last 20 balance updates
      if (state.latestBalanceUpdates.length > 20) {
        state.latestBalanceUpdates = state.latestBalanceUpdates.slice(0, 20);
      }
    },

    // System notifications
    addNotification: (
      state,
      action: PayloadAction<
        Omit<SystemNotification, 'id' | 'timestamp' | 'read'>
      >
    ) => {
      const notification: SystemNotification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        read: false,
      };

      state.notifications.unshift(notification);
      state.unreadNotificationCount += 1;

      // Keep last 50 notifications
      if (state.notifications.length > 50) {
        const removed = state.notifications.slice(50);
        state.notifications = state.notifications.slice(0, 50);

        // Adjust unread count for removed notifications
        const removedUnread = removed.filter(n => !n.read).length;
        state.unreadNotificationCount = Math.max(
          0,
          state.unreadNotificationCount - removedUnread
        );
      }
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        n => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotificationCount = Math.max(
          0,
          state.unreadNotificationCount - 1
        );
      }
    },

    markAllNotificationsRead: state => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadNotificationCount = 0;
    },

    clearNotifications: state => {
      state.notifications = [];
      state.unreadNotificationCount = 0;
    },

    // UI state
    toggleConnectionStatus: state => {
      state.showConnectionStatus = !state.showConnectionStatus;
    },

    toggleEventLog: state => {
      state.showEventLog = !state.showEventLog;
    },

    // Cleanup and reset
    resetWebSocketState: () => initialState,

    clearConnectionHistory: state => {
      state.connectionHistory = [];
    },
  },
});

export const {
  setConnectionState,
  setConnectionConfig,
  setConnectionError,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  addEvent,
  clearEvents,
  updateCampaignMetrics,
  setCampaignPublished,
  updateCampaignStatus,
  addBalanceUpdate,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  toggleConnectionStatus,
  toggleEventLog,
  resetWebSocketState,
  clearConnectionHistory,
} = webSocketSlice.actions;

export default webSocketSlice.reducer;
