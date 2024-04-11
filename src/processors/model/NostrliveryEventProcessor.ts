import {NostrliveryResponse} from "./NostrliveryResponse";

export interface NostrliveryEventProcessor {
    process(npub: string, params: Object): Promise<NostrliveryResponse | null>
}