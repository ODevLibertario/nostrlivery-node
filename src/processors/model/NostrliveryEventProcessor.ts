import {NostrEvent} from "../../model/NostrEvent";

export interface NostrliveryEventProcessor {
    process(npub: string, params: any): Promise<NostrEvent | null>
}