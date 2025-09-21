/**
 * WebSocket Crypto Utilities for Frontend
 *
 * Handles encryption/decryption of WebSocket messages
 * Should match the backend implementation
 */

// For now, implementing a simple base64 decode as placeholder
// In production, this should match the backend's encryption scheme

export async function decryptData(encryptedData: string): Promise<string> {
  try {
    // If encryption is not enabled or data is not encrypted, return as-is
    if (
      typeof encryptedData !== 'string' ||
      !encryptedData.includes('encrypted:')
    ) {
      return encryptedData;
    }

    // Remove prefix and decode base64 (simplified implementation)
    const dataWithoutPrefix = encryptedData.replace('encrypted:', '');

    // For now, just decode base64
    // In production, implement proper AES decryption to match backend
    try {
      return atob(dataWithoutPrefix);
    } catch (error) {
      console.error('Failed to decrypt WebSocket message:', error);
      return encryptedData; // Return original if decryption fails
    }
  } catch (error) {
    console.error('Error in decryptData:', error);
    return encryptedData;
  }
}

export async function encryptData(data: string): Promise<string> {
  try {
    // For now, just encode as base64 with prefix
    // In production, implement proper AES encryption to match backend
    return `encrypted:${btoa(data)}`;
  } catch (error) {
    console.error('Error in encryptData:', error);
    return data;
  }
}
