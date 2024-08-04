import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor"
import {RelayService} from "../service/RelayService"
import {finalizeEvent, nip19} from 'nostr-tools'
import {NostrEvent} from "../model/NostrEvent"
import {Filter} from "nostr-tools/lib/types/filter"

export class QueryEventsProcessor implements NostrliveryEventProcessor {

    private relayService = new RelayService()

    async process(npub:string, params: { filter: Filter }): Promise<NostrEvent | null> {
        const sk = nip19.decode(process.env.NOSTRLIVERY_NODE_NSEC)

        const events = await this.relayService.getEvents(params.filter)

        return finalizeEvent({
            kind: 20000,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: JSON.stringify(events),
        }, sk.data as Uint8Array) as NostrEvent
    }
}