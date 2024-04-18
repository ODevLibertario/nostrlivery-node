import {NostrEvent} from "../../model/NostrEvent";

export interface NostrliveryEventProcessor {
    process(npub: string, params: Object): Promise<NostrEvent | null>
}