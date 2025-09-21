# HashBuzz WebSocket Implementation

## Overview

This implementation provides a comprehensive WebSocket client system for the HashBuzz frontend application, enabling real-time communication with the backend for campaign updates, balance notifications, and system events.

## Architecture

### Hybrid Event System

- **HCS (Hedera Consensus Service)**: Major campaign milestones (published, closed, archived, reward distributed) with DB snapshots
- **WebSocket**: Real-time user notifications and immediate feedback for user experience

### File Structure

```
frontend/src/
├── services/websocket/
│   └── WebSocketClient.ts          # Core WebSocket client manager
├── utils/
│   └── wsCrypto.ts                 # Message encryption/decryption utilities
├── hooks/
│   ├── useWebSocket.ts             # React hooks for WebSocket functionality
│   └── useWebSocketContext.ts     # Context-based WebSocket hooks
├── contexts/
│   └── WebSocketContext.tsx       # React Context Provider for WebSocket
├── components/
│   ├── websocket/
│   │   └── WebSocketStatus.tsx    # WebSocket connection status component
│   └── campaign/
│       └── CampaignDashboard.tsx  # Real-time campaign dashboard
├── examples/
│   └── WebSocketIntegration.tsx   # Complete integration examples
└── tests/
    └── websocket.test.ts           # WebSocket client integration tests
```

## Core Features

### 1. WebSocket Client Manager (`WebSocketClient.ts`)

**Key Capabilities:**

- Automatic connection management with exponential backoff
- Event subscription system with type-safe handlers
- Message encryption/decryption support
- Connection state tracking and lifecycle management
- Heartbeat/ping system for connection health
- Automatic reconnection with configurable retry logic

**Usage:**

```typescript
const wsClient = createWebSocketClient(
  'ws://localhost:3001/ws',
  'your-access-token',
  {
    reconnectDelayMs: 3000,
    maxReconnectAttempts: 10,
    heartbeatIntervalMs: 30000,
  }
);

wsClient.on('CAMPAIGN_PUBLISHED_SUCCESS', ({ data }) => {
  console.log('Campaign published:', data);
});
```

### 2. React Hooks (`useWebSocket.ts`)

**Available Hooks:**

- `useWebSocket()`: Core WebSocket functionality
- `useCampaignWebSocket()`: Campaign-specific events
- `useBalanceWebSocket()`: Balance update events

**Example:**

```typescript
const websocket = useWebSocket({
  wsUrl: 'ws://localhost:3001/ws',
  accessToken: token,
  autoConnect: true,
});

const { campaignState } = useCampaignWebSocket(wsUrl, token, campaignId);
const { balances } = useBalanceWebSocket(wsUrl, token);
```

### 3. React Context Integration (`WebSocketContext.tsx`)

Provides application-wide WebSocket access:

```typescript
<WebSocketProvider wsUrl={wsUrl} accessToken={token}>
  <App />
</WebSocketProvider>
```

### 4. Event Types

The system handles the following event types:

- `CAMPAIGN_PUBLISHED_SUCCESS`
- `CAMPAIGN_STATUS_UPDATE`
- `CAMPAIGN_ENGAGEMENT_UPDATE`
- `BALANCE_UPDATE`
- `REWARD_DISTRIBUTION_UPDATE`
- `SYSTEM_NOTIFICATION`
- `ws:connected`, `ws:disconnected`, `ws:error`

## Event Data Formats

### Campaign Events

```typescript
interface CampaignPublishedEvent {
  eventType: 'CAMPAIGN_PUBLISHED_SUCCESS';
  campaignId: string;
  timestamp: string;
  userId: string;
}

interface CampaignStatusUpdateEvent {
  eventType: 'CAMPAIGN_STATUS_UPDATE';
  campaignId: string;
  newStatus: string;
  previousStatus: string;
  timestamp: string;
}
```

### Balance Events

```typescript
interface BalanceUpdateEvent {
  eventType: 'BALANCE_UPDATE';
  userId: string;
  balanceType: 'HBAR' | 'TOKEN';
  newBalance: string;
  previousBalance?: string;
  tokenId?: string;
  tokenSymbol?: string;
  timestamp: string;
}
```

## Security Features

### Message Encryption

- Optional message encryption using AES-256
- Configurable encryption keys via environment variables
- Base64 encoding for transport
- Graceful fallback for unencrypted messages

### Authentication

- JWT token-based authentication
- Automatic token refresh handling
- Connection-level access control

## Configuration

### Environment Variables

```bash
REACT_APP_WS_URL=ws://localhost:3001/ws
REACT_APP_WS_ENCRYPTION_KEY=your-32-char-encryption-key
```

### Default Configuration

```typescript
const defaultConfig = {
  reconnectDelayMs: 1000,
  maxReconnectAttempts: 5,
  heartbeatIntervalMs: 30000,
  connectionTimeoutMs: 10000,
};
```

## Component Examples

### WebSocket Status Monitor

```typescript
<WebSocketStatus wsUrl={wsUrl} accessToken={token} />
```

Shows connection status, error messages, and recent events.

### Real-time Campaign Dashboard

```typescript
<CampaignDashboard
  campaignId="campaign-123"
  wsUrl={wsUrl}
  accessToken={token}
/>
```

Displays real-time campaign metrics and engagement data.

## Testing

### Manual Testing

```typescript
import { runAllTests } from './tests/websocket.test';
runAllTests(); // Run in browser console
```

### Test Coverage

- Connection establishment and failure
- Event subscription and unsubscription
- Message encryption/decryption
- Reconnection logic
- Error handling

## Error Handling

The system includes comprehensive error handling:

- Network connectivity issues
- Authentication failures
- Message parsing errors
- Connection timeouts
- Server-side disconnections

## Performance Considerations

- **Event Throttling**: Limits rapid successive events
- **Memory Management**: Automatic cleanup of event listeners
- **Connection Pooling**: Single connection per user session
- **Message Queuing**: Handles offline message queuing

## Integration with Backend

### Backend Dependencies

- WebSocket server at `/ws` endpoint
- JWT authentication middleware
- Event broadcasting system
- Message encryption/decryption matching frontend

### Event Flow

1. Backend publishes events to WebSocket server
2. WebSocket server broadcasts to connected clients
3. Frontend WebSocket client receives and processes events
4. React components update in real-time via hooks/context

## Deployment Notes

### Production Considerations

- Use WSS (secure WebSocket) for production
- Configure proper CORS settings
- Set up load balancer WebSocket support
- Monitor connection metrics
- Implement proper error logging

### Scaling

- WebSocket connections scale per server instance
- Consider Redis pub/sub for multi-instance deployments
- Monitor memory usage for large numbers of connections

## Future Enhancements

1. **Message Persistence**: Store offline messages for later delivery
2. **Advanced Encryption**: Support for end-to-end encryption
3. **Message Compression**: Reduce bandwidth usage
4. **Advanced Reconnection**: Intelligent reconnection based on network conditions
5. **Event Analytics**: Track event delivery and performance metrics

## Troubleshooting

### Common Issues

1. **Connection Failures**: Check WebSocket URL and authentication token
2. **Event Not Received**: Verify event subscription and server-side broadcasting
3. **Encryption Errors**: Ensure matching encryption keys between frontend and backend
4. **Memory Leaks**: Proper cleanup of event listeners on component unmount

### Debug Tools

- WebSocket connection status component
- Event logging and monitoring
- Connection history tracking
- Real-time event viewer

This WebSocket implementation provides a robust foundation for real-time features in the HashBuzz application, supporting both immediate user feedback and reliable event delivery through the hybrid HCS + WebSocket architecture.
