#!/usr/bin/env node
//npm install nostr-tools
const { generateSecretKey, getPublicKey, nip19 } = require('nostr-tools');

function generateNostrKeyPair() {
    try {
        // Generate a private key (32 bytes, Uint8Array)
        const secretKeyBytes = generateSecretKey();
        
        // Convert to hex string for easier handling
        const privateKeyHex = Buffer.from(secretKeyBytes).toString('hex');
        
        // Derive the public key from the private key
        const publicKeyBytes = getPublicKey(secretKeyBytes);
        const publicKeyHex = Buffer.from(publicKeyBytes).toString('hex');
        
        // Convert to npub/nsec format
        const npub = nip19.npubEncode(publicKeyBytes);
        const nsec = nip19.nsecEncode(secretKeyBytes);
        
        console.log('🔑 Nostr Key Pair Generated:');
        console.log('================================');
        console.log(`Private Key (hex): ${privateKeyHex}`);
        console.log(`Public Key (hex):  ${publicKeyHex}`);
        console.log('');
        console.log(`NPUB (for .env): ${npub}`);
        console.log(`NSEC (for .env): ${nsec}`);
        console.log('================================');
        console.log('');
        console.log('⚠️  IMPORTANT SECURITY NOTES:');
        console.log('• Keep your private key secret and never share it');
        console.log('• Store your private key securely (password manager, hardware wallet, etc.)');
        console.log('• The public key can be shared freely');
        console.log('• Anyone with your private key can control your Nostr identity');
        console.log('');
        console.log('📝 Usage:');
        console.log('• Use the public key as your Nostr identifier');
        console.log('• Use the private key to sign events and prove ownership');
        
        return { privateKey: privateKeyHex, publicKey: publicKeyHex, npub, nsec };
    } catch (error) {
        console.error('❌ Error generating Nostr key pair:', error.message);
        process.exit(1);
    }
}

// Run the key generation if this script is executed directly
if (require.main === module) {
    generateNostrKeyPair();
}

module.exports = { generateNostrKeyPair };
