export enum NostrliveryEventType {
    LOGIN,
    PUBLISH_EVENT
}

export class NostrliveryEvent {
    eventType: NostrliveryEventType
    params: any

    constructor(eventType: NostrliveryEventType, params: any) {
        this.eventType = eventType
        this.params = params
    }
}