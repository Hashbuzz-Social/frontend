/**
 * WebSocket Integration Test
 *
 * Test file to verify WebSocket client integration
 * This can be run in the browser console for testing
 */

import { createWebSocketClient } from '../services/websocket/WebSocketClient';

// Test configuration
const TEST_CONFIG = {
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
  accessToken: 'test-token-123', // Replace with actual token
  encryptionKey:
    process.env.REACT_APP_WS_ENCRYPTION_KEY ||
    'test-key-32-chars-long-for-aes256',
};

// Test functions
export const testWebSocketConnection = async () => {
  // eslint-disable-next-line no-console
  console.log('🧪 Starting WebSocket Connection Test');

  try {
    // Create WebSocket client
    const wsClient = createWebSocketClient(
      TEST_CONFIG.wsUrl,
      TEST_CONFIG.accessToken,
      {
        reconnectDelayMs: 1000,
        maxReconnectAttempts: 3,
        heartbeatIntervalMs: 30000,
      }
    );

    // Test connection events
    wsClient.on('ws:connected', () => {
      // eslint-disable-next-line no-console
      console.log('✅ WebSocket connected successfully');
    });

    wsClient.on('ws:disconnected', () => {
      // eslint-disable-next-line no-console
      console.log('⚠️ WebSocket disconnected');
    });

    wsClient.on('ws:error', ({ data }) => {
      console.error('❌ WebSocket error:', data);
    });

    // Test campaign events
    wsClient.on('CAMPAIGN_PUBLISHED_SUCCESS', ({ data }) => {
      // eslint-disable-next-line no-console
      console.log('📢 Campaign Published:', data);
    });

    wsClient.on('BALANCE_UPDATE', ({ data }) => {
      // eslint-disable-next-line no-console
      console.log('💰 Balance Update:', data);
    });

    wsClient.on('CAMPAIGN_STATUS_UPDATE', ({ data }) => {
      // eslint-disable-next-line no-console
      console.log('📊 Campaign Status Update:', data);
    });

    wsClient.on('CAMPAIGN_ENGAGEMENT_UPDATE', ({ data }) => {
      // eslint-disable-next-line no-console
      console.log('❤️ Campaign Engagement Update:', data);
    });

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (wsClient.isConnected()) {
      // eslint-disable-next-line no-console
      console.log('✅ Connection test passed');

      // Test sending a message
      const testMessage = { type: 'PING', timestamp: new Date().toISOString() };
      const sent = wsClient.send(testMessage);

      if (sent) {
        // eslint-disable-next-line no-console
        console.log('✅ Message send test passed');
      } else {
        // eslint-disable-next-line no-console
        console.log('❌ Message send test failed');
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Connection test failed');
    }

    // Cleanup
    setTimeout(() => {
      wsClient.destroy();
      // eslint-disable-next-line no-console
      console.log('🧹 WebSocket client destroyed');
    }, 5000);

    return wsClient;
  } catch (error) {
    console.error('❌ WebSocket test failed:', error);
    throw error;
  }
};

export const testCrypto = async () => {
  // eslint-disable-next-line no-console
  console.log('🔐 Starting Crypto Test');

  try {
    const { encryptData, decryptData } = await import('../utils/wsCrypto');

    const testData = {
      eventType: 'BALANCE_UPDATE',
      userId: 'test-user-123',
      data: {
        balanceType: 'HBAR',
        newBalance: '100.50',
        timestamp: new Date().toISOString(),
      },
    };

    // eslint-disable-next-line no-console
    console.log('Original data:', testData);

    // Test encryption
    const encrypted = await encryptData(JSON.stringify(testData));
    // eslint-disable-next-line no-console
    console.log('Encrypted:', `${encrypted.substring(0, 50)}...`);

    // Test decryption
    const decrypted = await decryptData(encrypted);
    const parsedData = JSON.parse(decrypted);

    // eslint-disable-next-line no-console
    console.log('Decrypted data:', parsedData);

    // Verify integrity
    const isValid = JSON.stringify(testData) === JSON.stringify(parsedData);

    if (isValid) {
      // eslint-disable-next-line no-console
      console.log('✅ Crypto test passed - data integrity maintained');
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Crypto test failed - data corruption detected');
    }

    return { original: testData, decrypted: parsedData, isValid };
  } catch (error) {
    console.error('❌ Crypto test failed:', error);
    throw error;
  }
};

export const testEventHandlers = () => {
  // eslint-disable-next-line no-console
  console.log('🎯 Starting Event Handler Test');

  const wsClient = createWebSocketClient(
    TEST_CONFIG.wsUrl,
    TEST_CONFIG.accessToken
  );

  const receivedEvents: Array<{ type: string; data: unknown }> = [];

  // Test multiple event subscriptions
  const campaignHandler = ({ data }: { data: unknown }) => {
    // eslint-disable-next-line no-console
    console.log('📢 Campaign handler called:', data);
    receivedEvents.push({ type: 'campaign', data });
  };

  const balanceHandler = ({ data }: { data: unknown }) => {
    // eslint-disable-next-line no-console
    console.log('💰 Balance handler called:', data);
    receivedEvents.push({ type: 'balance', data });
  };

  // Subscribe to events
  wsClient.on('CAMPAIGN_PUBLISHED_SUCCESS', campaignHandler);
  wsClient.on('BALANCE_UPDATE', balanceHandler);

  // eslint-disable-next-line no-console
  console.log('✅ Event handlers registered');

  // Test unsubscription
  setTimeout(() => {
    wsClient.off('CAMPAIGN_PUBLISHED_SUCCESS', campaignHandler);
    // eslint-disable-next-line no-console
    console.log('✅ Campaign handler unsubscribed');
  }, 3000);

  // Cleanup after test
  setTimeout(() => {
    wsClient.destroy();
    // eslint-disable-next-line no-console
    console.log('🧹 Event handler test cleanup completed');
    // eslint-disable-next-line no-console
    console.log('📊 Received events:', receivedEvents);
  }, 10000);

  return wsClient;
};

// Manual test runner for browser console
export const runAllTests = async () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Running All WebSocket Tests');
  // eslint-disable-next-line no-console
  console.log('================================');

  try {
    // Test 1: Crypto functionality
    // eslint-disable-next-line no-console
    console.log('\n1️⃣ Testing Crypto Functions');
    await testCrypto();

    // Test 2: Event handlers
    // eslint-disable-next-line no-console
    console.log('\n2️⃣ Testing Event Handlers');
    testEventHandlers();

    // Test 3: Connection (async)
    // eslint-disable-next-line no-console
    console.log('\n3️⃣ Testing WebSocket Connection');
    await testWebSocketConnection();

    // eslint-disable-next-line no-console
    console.log('\n✅ All tests completed');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
};

// Export test configuration for use in other files
export { TEST_CONFIG };
