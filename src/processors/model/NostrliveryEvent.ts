export enum NostrliveryEventType {
    LOGIN
}

export class NostrliveryEvent {
    eventType: NostrliveryEventType;
    params: Object;

    constructor(eventType: NostrliveryEventType, params: Object) {
        this.eventType = eventType;
        this.params = params;
    }
}