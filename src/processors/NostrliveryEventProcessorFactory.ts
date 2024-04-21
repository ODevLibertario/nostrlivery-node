import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor"
import {NostrliveryEventType} from "./model/NostrliveryEvent"
import {LoginEventProcessor} from "./LoginEventProcessor"
import {PublishEventProcessor} from "./PublishEventProcessor"

export class NostrliveryEventProcessorFactory {

    private processors = {
        [NostrliveryEventType.LOGIN] : new LoginEventProcessor(),
        [NostrliveryEventType.PUBLISH_EVENT] : new PublishEventProcessor()
    }

    getInstance(eventType: NostrliveryEventType): NostrliveryEventProcessor {
        return this.processors[eventType.valueOf()]
    }

}