# AlgoPayX Environment Setup Guide

## Required API Keys and Services

### 1. Blockchain & Wallet Services
- **Infura**: Get API key from [infura.io](https://infura.io) for Ethereum network access
- **WalletConnect**: Create project at [cloud.walletconnect.com](https://cloud.walletconnect.com)
- **Alchemy**: Alternative to Infura, get key from [alchemy.com](https://alchemy.com)

### 2. Market Data APIs
- **Alpha Vantage**: Free tier available at [alphavantage.co](https://alphavantage.co)
- **CoinGecko Pro**: Paid API for crypto data at [coingecko.com](https://coingecko.com/api)
- **Polygon.io**: Stock market data at [polygon.io](https://polygon.io)

### 3. Payment Processing
- **Stripe**: Create account at [stripe.com](https://stripe.com) for card payments
- **Razorpay**: Indian payment gateway at [razorpay.com](https://razorpay.com)

### 4. Subscription Management
- **RevenueCat**: Mobile subscription management at [revenuecat.com](https://revenuecat.com)

### 5. Communication Services
- **Twilio**: SMS/Voice services at [twilio.com](https://twilio.com)
- **SendGrid**: Email services at [sendgrid.com](https://sendgrid.com)

## Setup Instructions

1. Copy `.env.example` to `.env.local`
2. Fill in your actual API keys and secrets
3. Generate secure random strings for encryption keys:
   \`\`\`bash
   # Generate 32-character encryption key
   openssl rand -hex 32
   \`\`\`
4. For production, use environment variables in your hosting platform
5. Never commit `.env.local` to version control

## Security Notes
- Keep all API keys secure and never expose them in client-side code
- Use different keys for development and production
- Regularly rotate sensitive keys
- Enable API key restrictions where possible (IP whitelisting, domain restrictions)
