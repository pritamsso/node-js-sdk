# JWT Revoke Node.js SDK

A Node.js SDK for the JWT Revoke API that provides easy integration with token revocation services. Built with resilience and reliability in mind using axios-retry for automatic retries and error handling.

## Installation

Install the package via npm:

npm install jwt-revoke axios axios-retry

Or using yarn:

yarn add jwt-revoke axios axios-retry

## Features

- Automatic retry with exponential backoff
- ⚡ Smart retry conditions for network errors
- ⏱️ Configurable timeouts
- 🔒 Built-in rate limit handling
- 🛡️ Custom error handling
- 🎯 Promise-based API
- 📦 TypeScript support

## Usage

### Basic Setup

const { JwtRevokeClient } = require('jwt-revoke');

// Initialize with default options
const client = new JwtRevokeClient('your_api_key_here');

// Or initialize with custom options
const clientWithOptions = new JwtRevokeClient('your_api_key_here', {
    maxRetries: 3,
    timeout: 10000, // 10 seconds
    baseURL: 'https://api.jwtrevoke.com',
    rateLimitRetryDelay: 1000 // 1 second
});

### List Revoked Tokens

try {
    const tokens = await client.listRevokedTokens();
    tokens.data.forEach(token => {
        console.log(`Token ID: ${token.id}, Reason: ${token.reason}`);
    });
} catch (error) {
    if (error.name === 'JwtRevokeError') {
        console.error(`API Error: ${error.message} (Status: ${error.status})`);
        console.error('Error Data:', error.data);
    }
}

### Revoke a Token

try {
    const revokedToken = await client.revokeToken(
        'token_123',
        'Security breach',
        new Date('2024-12-31T23:59:59Z')
    );
    console.log('Token revoked:', revokedToken);
} catch (error) {
    if (error.name === 'JwtRevokeError') {
        console.error(`API Error: ${error.message} (Status: ${error.status})`);
        console.error('Error Data:', error.data);
    }
}

### Delete a Revoked Token

try {
    await client.deleteRevokedToken('token_123');
    console.log('Token deletion successful');
} catch (error) {
    if (error.name === 'JwtRevokeError') {
        console.error(`API Error: ${error.message} (Status: ${error.status})`);
        console.error('Error Data:', error.data);
    }
}

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| maxRetries | Maximum number of retry attempts | 3 |
| timeout | Request timeout in milliseconds | 10000 |
| baseURL | API base URL | https://api.jwtrevoke.com |
| rateLimitRetryDelay | Delay for rate limit retries in milliseconds | 1000 |

## Error Handling

The SDK uses the JwtRevokeError class for error handling, which includes:

- message: Human-readable error message
- status: HTTP status code
- data: Raw response data from the API

## Dependencies

- axios (>= 0.21.1)
- axios-retry (>= 3.1.9)

## TypeScript Support

The SDK includes TypeScript type definitions out of the box. No additional @types packages are required.

## Best Practices

1. API Key Security: Store your API key securely in environment variables
2. Error Handling: Always use try-catch blocks with error type checking
3. Timeout Configuration: Adjust timeouts based on your application's needs
4. Rate Limiting: The SDK handles rate limits automatically with exponential backoff

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact our support team.