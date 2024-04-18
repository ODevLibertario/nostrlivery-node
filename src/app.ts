import express from 'express';
import {openDb} from "./database";
import {NostrliveryEventProcessorFactory} from "./processors/NostrliveryEventProcessorFactory";
import {NostrliveryEvent, NostrliveryEventType} from "./processors/model/NostrliveryEvent";
import {useWebSocketImplementation, verifyEvent} from 'nostr-tools'
import {NostrEvent} from "./model/NostrEvent";
import WebSocket from 'ws';

useWebSocketImplementation(WebSocket)

const app = express();
app.use(express.json());
const port = 3000;

openDb()

const eventProcessorFactory = new NostrliveryEventProcessorFactory()


app.get('/identity', async (req, res) => {
    res.status(200).send(process.env.NOSTRLIVERY_NODE_NPUB)
})


//TODO how do we stop an attack where some registers millions of fake users
app.post('/entrypoint', async (req, res) => {
    try {
        const event: NostrEvent = new NostrEvent(req.body)

        const verifyResult = verifyEvent(event)

        if(!verifyResult) {
            return res.status(400).json({error: 'Authentication failed'})
        }

        const jsonNostrliveryEvent = JSON.parse(event.content)

        const nostrliveryEvent = new NostrliveryEvent(
            NostrliveryEventType[jsonNostrliveryEvent['eventType'] as keyof typeof NostrliveryEventType],
            jsonNostrliveryEvent['params'] as Object
        )

        const result = await eventProcessorFactory
            .getInstance(nostrliveryEvent.eventType)
            .process(event.pubkey, nostrliveryEvent.params)

        res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({error: e.message})
    }

});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});