/**
 * Frontend WebSocket Client Manager
 *
 * Manages WebSocket connection to backend for real-time notifications
 * Handles JWT authentication, encrypted messages, reconnection, and event subscription
 */

import { decryptData } from '../utils/wsCrypto';

export interface WebSocketConfig {
  wsUrl: string;
  accessToken: string;
  enableEncryption: boolean;
  heartbeatIntervalMs: number;
  connectionTimeoutMs: number;
  maxReconnectAttempts: number;
  reconnectDelayMs: number;
}

export interface WebSocketEventData {
  type: string;
  userId: string;
  timestamp: number;
  data: any;
}

export type WebSocketEventHandler = (eventData: WebSocketEventData) => void;

export class WebSocketClientManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isDestroyed = false;

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.connect();
  }

  /**
   * Connect to WebSocket server
   */
  private connect(): void {
    if (this.isConnecting || this.isDestroyed) return;

    this.isConnecting = true;

    try {
      const wsUrl = `${this.config.wsUrl}?access_token=${encodeURIComponent(this.config.accessToken)}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket connection open
   */
  private handleOpen(): void {
    console.log('WebSocket connected successfully');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.emit('ws:connected', { timestamp: Date.now() });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private async handleMessage(event: MessageEvent): Promise<void> {
    try {
      let messageData: string;

      if (this.config.enableEncryption) {
        // Decrypt the message if encryption is enabled
        messageData = await decryptData(event.data);
      } else {
        messageData = event.data;
      }

      const parsedData = JSON.parse(messageData);

      // Emit the event to registered handlers
      this.emit(parsedData.event || 'message', parsedData.data || parsedData);
    } catch (error) {
      console.error('Failed to handle WebSocket message:', error);
      console.error('Raw message:', event.data);
    }
  }

  /**
   * Handle WebSocket connection close
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    this.cleanup();

    this.emit('ws:disconnected', {
      code: event.code,
      reason: event.reason,
      timestamp: Date.now(),
    });

    if (!this.isDestroyed && !event.wasClean) {
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket errors
   */
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.emit('ws:error', { error: event, timestamp: Date.now() });
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.config.heartbeatIntervalMs);
  }

  /**
   * Stop heartbeat timer
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (
      this.isDestroyed ||
      this.reconnectAttempts >= this.config.maxReconnectAttempts
    ) {
      console.log('Max reconnection attempts reached or client destroyed');
      return;
    }

    this.reconnectAttempts++;
    const delay =
      this.config.reconnectDelayMs * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Clean up connection resources
   */
  private cleanup(): void {
    this.isConnecting = false;
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
    }
  }

  /**
   * Emit event to registered handlers
   */
  private emit(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler({ type: eventType, userId: '', timestamp: Date.now(), data });
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to WebSocket events
   */
  public on(eventType: string, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  /**
   * Unsubscribe from WebSocket events
   */
  public off(eventType: string, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
      }
    }
  }

  /**
   * Subscribe to campaign published success events
   */
  public onCampaignPublished(handler: (data: any) => void): void {
    this.on('CAMPAIGN_PUBLISHED_SUCCESS', ({ data }) => handler(data));
  }

  /**
   * Subscribe to balance update events
   */
  public onBalanceUpdate(handler: (data: any) => void): void {
    this.on('BALANCE_UPDATE', ({ data }) => handler(data));
  }

  /**
   * Subscribe to campaign status update events
   */
  public onCampaignStatusUpdate(handler: (data: any) => void): void {
    this.on('CAMPAIGN_STATUS_UPDATE', ({ data }) => handler(data));
  }

  /**
   * Subscribe to campaign engagement update events
   */
  public onCampaignEngagementUpdate(handler: (data: any) => void): void {
    this.on('CAMPAIGN_ENGAGEMENT_UPDATE', ({ data }) => handler(data));
  }

  /**
   * Subscribe to reward distribution update events
   */
  public onRewardDistributionUpdate(handler: (data: any) => void): void {
    this.on('REWARD_DISTRIBUTION_UPDATE', ({ data }) => handler(data));
  }

  /**
   * Subscribe to system notifications
   */
  public onSystemNotification(handler: (data: any) => void): void {
    this.on('SYSTEM_NOTIFICATION', ({ data }) => handler(data));
  }

  /**
   * Send message to server (if needed for bidirectional communication)
   */
  public send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Get connection status
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   */
  public getState(): string {
    if (!this.ws) return 'DISCONNECTED';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * Force reconnection
   */
  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    setTimeout(() => this.connect(), 1000);
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  /**
   * Destroy WebSocket client and clean up all resources
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.disconnect();
    this.eventHandlers.clear();
  }

  /**
   * Update access token and reconnect if needed
   */
  public updateToken(newToken: string): void {
    this.config.accessToken = newToken;
    if (this.isConnected()) {
      // Reconnect with new token
      this.reconnect();
    }
  }
}

// Default configuration
export const defaultWebSocketConfig: Partial<WebSocketConfig> = {
  enableEncryption: true,
  heartbeatIntervalMs: 30000, // 30 seconds
  connectionTimeoutMs: 10000, // 10 seconds
  maxReconnectAttempts: 5,
  reconnectDelayMs: 1000, // Start with 1 second, exponential backoff
};

// Factory function to create WebSocket client with default config
export function createWebSocketClient(
  wsUrl: string,
  accessToken: string,
  customConfig?: Partial<WebSocketConfig>
): WebSocketClientManager {
  const config: WebSocketConfig = {
    wsUrl,
    accessToken,
    ...defaultWebSocketConfig,
    ...customConfig,
  } as WebSocketConfig;

  return new WebSocketClientManager(config);
}
