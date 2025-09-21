# WebSocket Redux Integration Guide

## Overview

This guide shows how to integrate the WebSocket real-time event system with your Redux store for campaign management and balance updates.

## Architecture

```
WebSocket Server (Backend)
    ↓ (Real-time events)
WebSocket Middleware (Frontend Redux)
    ↓ (Dispatches actions)
Redux Store State Updates
    ↓ (State changes)
React Components (via hooks)
    ↓ (UI updates)
User Interface
```

## Setup Instructions

### 1. Initialize WebSocket Connection

```typescript
import { initializeWebSocketConnection } from '../Store/webSocketInitializer';

// After user authentication
const token = getUserAuthToken(); // Get from your auth system
initializeWebSocketConnection(token);
```

### 2. Using WebSocket in Components

```typescript
import {
  useWebSocketState,
  useWebSocketConnection,
  useCampaignWebSocketUpdates,
  useBalanceWebSocketUpdates,
  useWebSocketNotifications,
  useUnreadNotificationCount,
} from '../Store/webSocketHooks';

const MyComponent = () => {
  // Connection state
  const { connectionState, isConnected } = useWebSocketState();

  // Real-time campaign data
  const campaignUpdates = useCampaignWebSocketUpdates('your-campaign-id');

  // Real-time balance updates
  const balanceUpdates = useBalanceWebSocketUpdates();

  // System notifications
  const notifications = useWebSocketNotifications();
  const unreadCount = useUnreadNotificationCount();

  return (
    <div>
      <div>Status: {connectionState}</div>
      {campaignUpdates.campaignData && (
        <div>
          Likes: {campaignUpdates.campaignData.engagementMetrics.totalLikes}
        </div>
      )}
      <div>Unread notifications: {unreadCount}</div>
    </div>
  );
};
```

### 3. Manual Connection Control

```typescript
import { useWebSocketConnection } from '../Store/webSocketHooks';

const ConnectionControl = () => {
  const { connect, disconnect, connectionState } = useWebSocketConnection();

  return (
    <div>
      <button onClick={() => connect('ws://localhost:8080', 'your-token')}>
        Connect
      </button>
      <button onClick={disconnect}>
        Disconnect
      </button>
      <div>Status: {connectionState}</div>
    </div>
  );
};
```

## Event Types Handled

### Campaign Events

- `CAMPAIGN_PUBLISHED_SUCCESS` - Campaign successfully published
- `CAMPAIGN_STATUS_UPDATE` - Campaign status changed
- `CAMPAIGN_ENGAGEMENT_UPDATE` - Real-time engagement metrics update

### Balance Events

- `BALANCE_UPDATE` - HBAR or token balance changed
- `BALANCE_SYNC_COMPLETE` - All balances synchronized

### System Events

- `SYSTEM_NOTIFICATION` - Important system messages
- Connection events (connect, disconnect, error, reconnect)

## Testing and Development

### Using Test Utilities

```typescript
import {
  simulateCampaignUpdate,
  simulateBalanceUpdate,
  simulateSystemNotification,
  startEventSimulation,
} from '../utils/webSocketTestUtils';

// Simulate single events
simulateCampaignUpdate('campaign-123');
simulateBalanceUpdate('HBAR');
simulateSystemNotification('info');

// Start continuous simulation (development only)
const interval = startEventSimulation(3000); // Every 3 seconds
// Stop with: stopEventSimulation(interval);
```

### Development Dashboard

Use the `CampaignRealTimeDashboard` component to test and monitor WebSocket events:

```typescript
import CampaignRealTimeDashboard from '../components/campaign/CampaignRealTimeDashboard';

const App = () => (
  <div>
    <CampaignRealTimeDashboard
      campaignId="your-campaign-id"
      enableTestMode={true} // Shows test controls in development
    />
  </div>
);
```

## Redux State Structure

The WebSocket state is stored in `store.webSocket`:

```typescript
{
  connectionState: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'RECONNECTING' | 'ERROR',
  isConnected: boolean,
  reconnectAttempts: number,
  lastError: string | null,
  wsUrl: string | null,
  accessToken: string | null,
  events: WebSocketEvent[],
  campaignMetrics: { [campaignId: string]: CampaignMetrics },
  latestBalanceUpdates: BalanceUpdate[],
  notifications: SystemNotification[],
  unreadNotificationCount: number,
  showConnectionStatus: boolean,
  showEventLog: boolean
}
```

## Environment Variables

Set these in your `.env` file:

```bash
# Development
REACT_APP_WS_URL_DEV=ws://localhost:8080

# Production
REACT_APP_WS_URL_PROD=wss://api.hashbuzz.social/ws
```

## Integration with Existing Components

### Campaign Components

Replace direct API calls with WebSocket hooks for real-time updates:

```typescript
// Before: useEffect with API polling
// useEffect(() => {
//   const interval = setInterval(() => {
//     fetchCampaignData(campaignId);
//   }, 5000);
//   return () => clearInterval(interval);
// }, [campaignId]);

// After: Real-time updates via WebSocket
const campaignUpdates = useCampaignWebSocketUpdates(campaignId);
```

### Balance Components

```typescript
// Before: Manual balance refresh
// const refreshBalances = () => {
//   fetchUserBalances();
// };

// After: Automatic real-time balance updates
const balanceUpdates = useBalanceWebSocketUpdates();
useEffect(() => {
  if (balanceUpdates.hasUpdates) {
    // Balance automatically updated in Redux store
  }
}, [balanceUpdates.hasUpdates]);
```

## Error Handling

The WebSocket middleware automatically handles:

- Connection failures
- Automatic reconnection attempts
- Error notifications to users
- Connection state management

Monitor connection state and show appropriate UI:

```typescript
const { connectionState, lastError } = useWebSocketState();

return (
  <div>
    {connectionState === 'ERROR' && (
      <div className="error">
        Connection error: {lastError}
      </div>
    )}
    {connectionState === 'RECONNECTING' && (
      <div className="warning">
        Reconnecting to live updates...
      </div>
    )}
  </div>
);
```

## Best Practices

1. **Initialize connection after authentication**: Only connect when user is authenticated
2. **Clean up on logout**: Call `cleanupWebSocketConnection()` when user logs out
3. **Use typed hooks**: Always use the provided typed hooks for type safety
4. **Handle offline states**: Show appropriate UI when WebSocket is disconnected
5. **Test with simulation**: Use test utilities during development
6. **Monitor performance**: WebSocket events are frequent, ensure components re-render efficiently

## Troubleshooting

### Common Issues

1. **Connection fails**: Check WebSocket URL and authentication token
2. **Events not received**: Verify middleware is added to store configuration
3. **State not updating**: Ensure components use WebSocket hooks, not direct API calls
4. **Memory leaks**: Make sure to cleanup connections on component unmount

### Debug Information

```typescript
import {
  logWebSocketState,
  getWebSocketDebugInfo,
} from '../utils/webSocketTestUtils';

// Log current state to console (development only)
logWebSocketState();

// Get debug information
const debugInfo = getWebSocketDebugInfo();
console.log('WebSocket Debug Info:', debugInfo);
```

## Next Steps

1. Integrate WebSocket hooks into existing campaign and balance components
2. Replace polling mechanisms with real-time WebSocket updates
3. Add user preferences for enabling/disabling real-time updates
4. Implement push notifications for critical events
5. Add analytics tracking for WebSocket event engagement
