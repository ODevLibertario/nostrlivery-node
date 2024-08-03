import express from 'express'
import {openDb} from "./database"
import {NostrliveryEventProcessorFactory} from "./processors/NostrliveryEventProcessorFactory"
import {NostrliveryEvent, NostrliveryEventType} from "./processors/model/NostrliveryEvent"
import {nip19, useWebSocketImplementation, verifyEvent} from 'nostr-tools'
import {NostrEvent} from "./model/NostrEvent"
import WebSocket from 'ws'
import {config} from 'dotenv'

import { schnorr } from '@noble/curves/secp256k1'
import { bytesToHex } from '@noble/hashes/utils'
import { sha256 } from '@noble/hashes/sha256'
import {NostrliveryNodeResponseBody} from "./processors/model/NostrliveryNodeResponseBody"
import driverRouter from "./routes/driverRoutes"
import {ProfileService} from "./service/ProfileService"

config()

useWebSocketImplementation(WebSocket)

const app = express()
app.use(express.json())
const port = 3000

openDb()

const eventProcessorFactory = new NostrliveryEventProcessorFactory()
const profileService = new ProfileService()
const utf8Encoder: TextEncoder = new TextEncoder()

app.use(driverRouter)

app.get('/identity', async (req, res) => {
    res.status(200).send(process.env.NOSTRLIVERY_NODE_NPUB)
})

app.get('/username/:npub', async (req, res) => {

    try{
        const username = await profileService.getUsername(req.params.npub)

        if(username) {
            return res.status(200).send(wrapResponseBody(username))
        } else {
            return res.status(404).send()
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send()
    }

})

export function wrapResponseBody(response: any) {
    const responseHash = sha256(utf8Encoder.encode(response))
    const sig = bytesToHex(schnorr.sign(responseHash, nip19.decode(process.env.NOSTRLIVERY_NODE_NSEC).data as Uint8Array))
    return new NostrliveryNodeResponseBody(response, sig)
}


//TODO how do we stop an attack where some registers millions of fake users
app.post('/entrypoint', async (req, res) => {
    try {
        const event: NostrEvent = new NostrEvent(req.body)

        const verifyResult = verifyEvent(event)

        if (!verifyResult) {
            return res.status(400).json({error: 'Authentication failed'})
        }

        const jsonNostrliveryEvent = JSON.parse(event.content)

        const nostrliveryEvent = new NostrliveryEvent(
            NostrliveryEventType[jsonNostrliveryEvent['eventType'] as keyof typeof NostrliveryEventType],
            jsonNostrliveryEvent['params'] as any
        )

        const result = await eventProcessorFactory
            .getInstance(nostrliveryEvent.eventType)
            .process(event.pubkey, nostrliveryEvent.params)

        res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({error: e.message})
    }

})

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
})