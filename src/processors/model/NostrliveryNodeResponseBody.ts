export class NostrliveryNodeResponseBody {
    body: any
    signature: string

    constructor(body: any, signature: string) {
        this.body = body
        this.signature = signature
    }
}