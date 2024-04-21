# Nostrlivery Node

The backend of the decentralized delivery app

### Required Env vars

- NOSTRLIVERY_NODE_NPUB - Your node's npub, create a dedicated nostr profile for it
- NOSTRLIVERY_NODE_NPUB - Your node's nsec
- RELAY_URL_LIST - Comma separated list of relays to connect to, for development we recommend running the local-relay

### How to use the local-relay for development
1. Run the shell script start-local-relay.sh to get the container running
2. Set your env variable RELAY_URL_LIST=ws://localhost:7000
3. Done
