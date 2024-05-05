import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor"
import {RelayService} from "../service/RelayService"
import {finalizeEvent, nip19} from 'nostr-tools'
import {NostrEvent} from "../model/NostrEvent"
import {Filter} from "nostr-tools/lib/types/filter";

//TODO should we allow frontend direct connection to the relay?
export class QueryEventProcessor implements NostrliveryEventProcessor {

    private relayService = new RelayService()

    async process(npub:string, params: { filter: Filter }): Promise<NostrEvent | null> {
        const sk = nip19.decode(process.env.NOSTRLIVERY_NODE_NSEC)

        const event = await this.relayService.getSingleEvent(params.filter)

        return finalizeEvent({
            kind: 20000,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: event ? JSON.stringify(event["content"]) : "{}",
        }, sk.data as Uint8Array) as NostrEvent
    }
}