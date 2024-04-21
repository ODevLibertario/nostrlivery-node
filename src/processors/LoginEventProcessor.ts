import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor";
import {RelayService} from "../service/RelayService";
import {finalizeEvent, nip19} from 'nostr-tools'
import {NostrEvent} from "../model/NostrEvent";

export class LoginEventProcessor implements NostrliveryEventProcessor {

    private relayService = new RelayService()

    async process(npub:string, params:any): Promise<NostrEvent | null> {
        const sk = nip19.decode(process.env.NOSTRLIVERY_NODE_NSEC)

        const profileEvent = await this.relayService.getSingleEvent(
            {
                authors: [npub],
                kinds: [0],
            }
        )

        return finalizeEvent({
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: JSON.stringify(profileEvent["content"]),
        }, sk.data as Uint8Array) as NostrEvent
    }
}