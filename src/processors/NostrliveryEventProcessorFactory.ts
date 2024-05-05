import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor"
import {NostrliveryEventType} from "./model/NostrliveryEvent"
import {PublishEventProcessor} from "./PublishEventProcessor"
import {QueryEventProcessor} from "./QueryEventProcessor";

export class NostrliveryEventProcessorFactory {

    private processors = {
        [NostrliveryEventType.PUBLISH_EVENT] : new PublishEventProcessor(),
        [NostrliveryEventType.QUERY_EVENT] : new QueryEventProcessor(),
    }

    getInstance(eventType: NostrliveryEventType): NostrliveryEventProcessor {
        return this.processors[eventType.valueOf()]
    }

}