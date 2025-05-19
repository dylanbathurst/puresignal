# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within PureSignal, please send an email to [puresignalapp@gmail.com]. All security vulnerabilities will be promptly addressed.

## Security Features

### Private Key Management

- PureSignal uses Nostr for decentralized authentication
- Private keys are never stored in plain text
- Keys are stored securely using `expo-secure-store`
- The app never transmits private keys to any server
- Private keys are only used locally for signing events

### Data Storage

- Sensitive data is stored using `expo-secure-store`
- Caching is implemented using SQLite with proper encryption
- No sensitive data is stored in AsyncStorage or other unsecured storage

### Network Security

- All Nostr relay connections use secure WebSocket (wss://)
- Explicit relay URLs are used to prevent man-in-the-middle attacks
- All network requests are made over HTTPS

### Authentication

- Decentralized authentication through Nostr
- No central server storing user credentials
- Private keys are required for all authenticated actions

## Best Practices for Users

1. **Private Key Security**

   - Never share your private key with anyone
   - Store your private key securely offline
   - Use a strong, unique private key

2. **Network Security**
   - Use a secure network connection
   - Avoid using public Wi-Fi for sensitive operations
   - Consider using a VPN for additional security

## Security Measures

### Input Validation

- All user inputs are validated before processing
- Content is validated before publishing to Nostr

## Dependencies

PureSignal uses the following security-critical packages:

- `expo-secure-store` for secure storage
- `expo-crypto` for cryptographic operations
- `@nostr-dev-kit/ndk` for Nostr protocol implementation

All dependencies are regularly updated to their latest secure versions.

## Updates

Security updates will be released as soon as possible after vulnerabilities are discovered. Users are encouraged to:

- Keep the app updated to the latest version
- Enable automatic updates if available
- Check for updates regularly

## Contact

For security-related questions or concerns, please contact:

- Email: [puresignalapp@gmail.com]
- GitHub: [dylanbathurst]

## License

This security policy is licensed under the MIT License - see the LICENSE file for details.
