export enum NostrliveryEventType {
    PUBLISH_EVENT,
    QUERY_EVENT
}

export class NostrliveryEvent {
    eventType: NostrliveryEventType
    params: any

    constructor(eventType: NostrliveryEventType, params: any) {
        this.eventType = eventType
        this.params = params
    }
}