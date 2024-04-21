import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor"
import {RelayService} from "../service/RelayService"
import {finalizeEvent, nip19} from 'nostr-tools'
import {NostrEvent} from "../model/NostrEvent"

//TODO should we allow frontend direct connection to the relay?
export class PublishEventProcessor implements NostrliveryEventProcessor {

    private relayService = new RelayService()

    async process(npub:string, params: { event: NostrEvent }): Promise<NostrEvent | null> {
        const sk = nip19.decode(process.env.NOSTRLIVERY_NODE_NSEC)

        const event = finalizeEvent({
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: params.event.content,
        }, sk.data as Uint8Array) as NostrEvent

        await this.relayService.publish(params.event)

        return event
    }
}