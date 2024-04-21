import {NostrEvent as NostrToolsEvent} from "nostr-tools/lib/types/core";

export class NostrEvent implements NostrToolsEvent{
    content: string;
    created_at: number;
    id: string;
    kind: number;
    pubkey: string;
    sig: string;
    tags: string[][];


    constructor(object: any) {
        this.content = object['content'];
        this.created_at = object['created_at'];
        this.id = object['id'];
        this.kind = object['kind'];
        this.pubkey = object['pubkey'];
        this.sig = object['sig'];
        this.tags = object['tags'];
    }
}