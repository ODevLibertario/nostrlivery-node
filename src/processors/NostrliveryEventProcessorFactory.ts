import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor"
import {NostrliveryEventType} from "./model/NostrliveryEvent"
import {PublishEventProcessor} from "./PublishEventProcessor"
import {QueryEventProcessor} from "./QueryEventProcessor"
import {QueryEventsProcessor} from "./QueryEventsProcessor"

export class NostrliveryEventProcessorFactory {

    private processors = {
        [NostrliveryEventType.PUBLISH_EVENT] : new PublishEventProcessor(),
        [NostrliveryEventType.QUERY_EVENT] : new QueryEventProcessor(),
        [NostrliveryEventType.QUERY_EVENTS] : new QueryEventsProcessor(),
    }

    getInstance(eventType: NostrliveryEventType): NostrliveryEventProcessor {
        return this.processors[eventType.valueOf()]
    }

}