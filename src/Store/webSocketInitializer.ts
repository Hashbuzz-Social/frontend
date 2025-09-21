import { store } from './store';
import { setConnectionConfig, setConnectionState } from './webSocketSlice';

/**
 * Initialize WebSocket connection with authentication
 * Should be called after user authentication is complete
 */
export const initializeWebSocketConnection = (token: string) => {
  const dispatch = store.dispatch;

  try {
    // Set connection config first
    dispatch(
      setConnectionConfig({
        wsUrl: getWebSocketUrl(),
        accessToken: token,
      })
    );

    // Set connection state to connecting - middleware will handle the actual connection
    dispatch(setConnectionState('CONNECTING'));
  } catch (error) {
    console.error('Failed to initialize WebSocket connection:', error);
    dispatch(setConnectionState('ERROR'));
  }
};

/**
 * Cleanup WebSocket connection
 * Should be called on logout or component unmount
 */
export const cleanupWebSocketConnection = () => {
  const dispatch = store.dispatch;

  // The middleware will handle the actual cleanup when the disconnect action is dispatched
  dispatch(setConnectionState('DISCONNECTED'));
};

/**
 * Check if WebSocket should auto-connect
 * Based on authentication state and user preferences
 */
export const shouldAutoConnectWebSocket = (): boolean => {
  const state = store.getState();

  // Add your logic here based on your auth slice
  // For example:
  // return state.auth.isAuthenticated && state.auth.user?.preferences?.enableRealTimeUpdates;

  // For now, return true if we have any auth state
  return !!state.auth;
};

/**
 * Get WebSocket URL based on environment
 */
export const getWebSocketUrl = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return process.env.REACT_APP_WS_URL_DEV || 'ws://localhost:8080';
  }

  return process.env.REACT_APP_WS_URL_PROD || 'wss://api.hashbuzz.social/ws';
};
