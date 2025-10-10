# Nostrlivery Node

The backend of the decentralized delivery app built on Nostr protocol.

## Quick Start

### 1. Generate Nostr Keys

First, generate a dedicated Nostr key pair for your node:

```bash
node generate-nostr-key.js
```

This will output your private key (nsec) and public key (npub) in both hex and npub/nsec formats. **Keep your private key secure!**

### 2. Set Up Environment Variables

Create a `.env` file with your generated keys:

```bash
NOSTRLIVERY_NODE_NPUB=npub1qpfswwjps7y8e5f89drhaxh8w3xjrzdh7dhmk7d764szg5gflywsl3lyad
NOSTRLIVERY_NODE_NSEC=nsec1z0mf5d4jqa4pfh8drs6mrfdln077flnt6z3eayq6y0ct5svk5vass0p5lj
RELAY_URL_LIST=ws://localhost:7000
```

- `NOSTRLIVERY_NODE_NPUB` - Your node's public key (npub) from step 1
- `NOSTRLIVERY_NODE_NSEC` - Your node's private key (nsec) from step 1  
- `RELAY_URL_LIST` - Comma separated list of relays to connect to

### 3. Start Local Relay (Development)

For development, start the local Nostr relay:

```bash
cd local-relay
./start-local-relay.sh
```

The relay will be accessible at:
- **HTTP**: `http://localhost:7000`
- **WebSocket**: `ws://localhost:7000`

### 4. Install Dependencies & Run

```bash
npm install
npm start
```

The Node.js server will start on port 3000 and connect to the local relay on port 7000.

## API Endpoints

The Node.js server runs on port 3000 and provides the following endpoints:

### Core Endpoints
- `GET /` - Server info and available endpoints
- `GET /identity` - Returns the node's npub (public key)
- `GET /health` - Server health status
- `POST /entrypoint` - Accepts Nostr events for processing

### User Management
- `GET /username/:npub` - Get username for a given npub
- `GET /driver/company-associations/:npub` - Get driver company associations

### Example Usage

```bash
# Get node identity
curl http://localhost:3000/identity

# Check server health
curl http://localhost:3000/health

# Get server info
curl http://localhost:3000/
```

## Architecture

### Services Running
1. **Nostr Relay** (Port 7000) - Handles Nostr protocol WebSocket connections
2. **Node.js API Server** (Port 3000) - REST API for mobile app integration

### Network Access
- **Local**: `http://localhost:3000` (API), `ws://localhost:7000` (Relay)
- **Network**: `http://192.168.1.199:3000` (API), `ws://192.168.1.199:7000` (Relay)

## Project Structure

- `src/` - Main application code
  - `app.ts` - Express server setup and routes
  - `service/` - Business logic services
  - `processors/` - Nostr event processors
  - `model/` - Data models
  - `routes/` - API route handlers
- `local-relay/` - Local Nostr relay for development
- `generate-nostr-key.js` - Script to generate Nostr key pairs
- `local-relay/data/` - Persistent storage for local relay

## Development Workflow

1. Start the local Nostr relay: `cd local-relay && ./start-local-relay.sh`
2. Start the Node.js server: `npm start`
3. Connect your mobile app to `http://192.168.1.199:3000`

## Security Notes

- **Never share your private key (nsec)** - it controls your Nostr identity
- Store your private key securely (password manager, hardware wallet, etc.)
- The public key (npub) can be shared freely as your identifier
- The server uses Nostr event verification for authentication
